#!/usr/bin/env bash
# Start today_art for verification: Django API on 127.0.0.1:8000 + React dev server on localhost:3000.
# Refuses to start if either port is already taken (the ports are hardcoded in CORS + setupProxy,
# so a second instance cannot run side by side).
# Usage: .claude/skills/verify-today-art/scripts/up.sh
set -uo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$HERE/../../../.." && pwd)"
RUN="$ROOT/.gstack/verify-run"
RUN_ID="$(date +%Y%m%d-%H%M%S)"
EVIDENCE="$ROOT/.gstack/verify-evidence/$RUN_ID"

port_busy() { netstat -ano | grep LISTENING | grep -qE "[:.]$1 "; }

if [ -f "$RUN/state" ]; then echo "REFUSE: $RUN/state exists. run down.sh first."; exit 1; fi
for p in 8000 3000; do
  if port_busy "$p"; then echo "REFUSE: port $p busy and not started by this run. stop it yourself; never kill by name."; exit 2; fi
done
mkdir -p "$RUN" "$EVIDENCE"

# --- backend ---
cd "$ROOT/backend" || exit 1
if [ ! -x dj_vv/Scripts/python.exe ]; then
  echo "venv missing: creating backend/dj_vv (python 3.13, same as Azure)"
  py -3.13 -m venv dj_vv && dj_vv/Scripts/python.exe -m pip install -q -r "$ROOT/requirements.txt" || exit 1
fi
# backend/.env is optional. Without it SECRET_KEY is empty and Django refuses to boot,
# so give a throwaway one. Env vars set here win over .env (load_dotenv does not override).
if ! { [ -f .env ] && grep -q '^SECRET_KEY=' .env; }; then export SECRET_KEY=verify-local-only; fi
export DEBUG=true
nohup dj_vv/Scripts/python.exe manage.py runserver 127.0.0.1:8000 --noreload > "$RUN/backend.log" 2>&1 &

# --- frontend ---
cd "$ROOT/frontend" || exit 1
[ -d node_modules ] || npm ci
# Repo quirk: committed public/index.html has `var allowed = {};` and the `prestart` hook
# (scripts/inject-theme-allowlist.js) fills it in place. On an already-filled file the hook
# finds nothing to change and THROWS, so plain `npm start` fails on every run after the first.
#   clean    -> npm start (hook fills the file); down.sh restores it afterwards
#   injected -> only the allowlist line differs: skip the hook, run react-scripts directly
#   edited   -> user has other edits: npm start as-is, leave the file alone
IDX=frontend/public/index.html
other_edits=$(git -C "$ROOT" diff -U0 -- "$IDX" | grep -E '^[-+] ' | grep -v 'var allowed = ')
if git -C "$ROOT" diff --quiet -- "$IDX"; then IDX_STATE=clean; START=(npm start)
elif [ -z "$other_edits" ]; then IDX_STATE=injected; START=(npx --no-install react-scripts start)
else IDX_STATE=edited; START=(npm start); fi
BROWSER=none PORT=3000 nohup "${START[@]}" > "$RUN/frontend.log" 2>&1 &

# --- wait until usable ---
for i in $(seq 1 30); do curl -sf http://127.0.0.1:8000/ >/dev/null && break; sleep 1; done
for i in $(seq 1 90); do
  grep -qiE "compiled|Failed to compile" "$RUN/frontend.log" 2>/dev/null && curl -sf http://localhost:3000/ >/dev/null && break
  sleep 2
done

BE=$(pwsh -NoProfile -File "$(cygpath -w "$HERE/ptree.ps1")" -Port 8000) || { echo "BACKEND NOT LISTENING. log: $RUN/backend.log"; tail -20 "$RUN/backend.log"; }
FE=$(pwsh -NoProfile -File "$(cygpath -w "$HERE/ptree.ps1")" -Port 3000) || { echo "FRONTEND NOT LISTENING. log: $RUN/frontend.log"; tail -20 "$RUN/frontend.log"; }
cat > "$RUN/state" <<EOF
RUN_ID=$RUN_ID
EVIDENCE=$EVIDENCE
BACKEND_OWNER=${BE%% *}
BACKEND_TOP=${BE##* }
FRONTEND_OWNER=${FE%% *}
FRONTEND_TOP=${FE##* }
IDX_STATE=$IDX_STATE
EOF
echo "EVIDENCE=$EVIDENCE"
"$HERE/doctor.sh"
