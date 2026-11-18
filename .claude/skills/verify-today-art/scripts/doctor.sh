#!/usr/bin/env bash
# Read-only check: is the verify instance worth driving? Exit 0 = drive, 1 = do not.
# Prints DATA=<n>. DATA=0 means data journeys (cards, results, calendar tags) cannot pass.
HERE="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$HERE/../../../.." && pwd)"
RUN="$ROOT/.gstack/verify-run"
bad=0
if [ ! -f "$RUN/state" ]; then echo "NO STATE: instance not started by up.sh. do not drive it."; exit 1; fi
# shellcheck disable=SC1091
. "$RUN/state"

owner_of() { netstat -ano | grep LISTENING | grep -E "[:.]$1 " | awk '{print $NF}' | head -1; }
o8=$(owner_of 8000); o3=$(owner_of 3000)
[ "$o8" = "$BACKEND_OWNER" ] && echo "OK port 8000 owner $o8 (ours)" || { echo "BAD port 8000 owner '$o8' != ours '$BACKEND_OWNER'"; bad=1; }
[ "$o3" = "$FRONTEND_OWNER" ] && echo "OK port 3000 owner $o3 (ours)" || { echo "BAD port 3000 owner '$o3' != ours '$FRONTEND_OWNER'"; bad=1; }

curl -s --max-time 5 http://127.0.0.1:8000/ | grep -q "Django is running" && echo "OK backend answers /" || { echo "BAD backend / not answering"; bad=1; }
curl -s --max-time 10 http://localhost:3000/ | grep -q 'id="root"' && echo "OK frontend serves index.html" || { echo "BAD frontend not serving"; bad=1; }
grep -q "Failed to compile" "$RUN/frontend.log" 2>/dev/null && { echo "BAD frontend compile error, see $RUN/frontend.log"; bad=1; }

total=$(curl -s --max-time 15 "http://127.0.0.1:8000/api/entries/?active=false&pSize=1" | grep -o '"total": [0-9]*' | grep -o '[0-9]*$')
echo "DATA=${total:-?} entries (active=false)"
if [ "${total:-0}" = "0" ]; then
  echo "WARN no data: backend/.env OPEN_API_KEY missing or invalid (gg.go.kr ERROR-290)."
  echo "     empty result is cached 1h in-process: after fixing the key, run down.sh + up.sh."
fi
exit $bad
