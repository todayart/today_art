#!/usr/bin/env bash
# gstack headless browser, pinned to this skill's own tab (session verify-todayart).
# Usage: b.sh goto http://localhost:3000/ | b.sh click '<sel>' | b.sh js '<expr>' | b.sh screenshot <path>
BROWSE_SESSION=verify-todayart exec ~/.claude/skills/gstack/browse/dist/browse.exe "$@"
