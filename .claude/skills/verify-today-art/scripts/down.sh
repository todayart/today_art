#!/usr/bin/env bash
# Tear down only what up.sh started (process trees recorded in state). Keeps evidence.
# Copies server logs into the evidence dir, then removes .gstack/verify-run.
HERE="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$HERE/../../../.." && pwd)"
RUN="$ROOT/.gstack/verify-run"
if [ ! -f "$RUN/state" ]; then echo "nothing to stop (no state)"; exit 0; fi
# shellcheck disable=SC1091
. "$RUN/state"
for pid in "$FRONTEND_TOP" "$BACKEND_TOP"; do
  [ -n "$pid" ] && taskkill //PID "$pid" //T //F >/dev/null 2>&1 && echo "stopped tree $pid"
done
BROWSE_SESSION=verify-todayart ~/.claude/skills/gstack/browse/dist/browse.exe closetab >/dev/null 2>&1 || true
# up.sh found index.html clean and the prestart hook dirtied it: put it back,
# but only if the allowlist line is the sole change.
IDX=frontend/public/index.html
if [ "${IDX_STATE:-}" = clean ] && ! git -C "$ROOT" diff --quiet -- "$IDX" \
   && [ -z "$(git -C "$ROOT" diff -U0 -- "$IDX" | grep -E '^[-+] ' | grep -v 'var allowed = ')" ]; then
  git -C "$ROOT" checkout -- "$IDX" && echo "restored $IDX (prestart hook edit)"
fi
mkdir -p "$EVIDENCE"
cp "$RUN"/*.log "$EVIDENCE"/ 2>/dev/null
rm -rf "$RUN"
sleep 1
netstat -ano | grep LISTENING | grep -E "[:.](8000|3000) " && echo "WARN port still busy" || echo "ports 8000/3000 free"
echo "evidence kept: $EVIDENCE"
