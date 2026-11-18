---
name: verify-today-art
description: Drive the today_art web app (React frontend on localhost:3000 + Django API on 127.0.0.1:8000) in a headless browser the way a user does, and capture proof. Use to prove a UI or API change works end to end — theme switch, main search, category filter, list sort, calendar — instead of only reading code or running unit tests.
---

# verify-today-art

today_art = exhibition finder. Users touch the **web UI** (React 18, CRA, react-router).
It calls the **Django API** (`/api/entries/`, `/api/calendar/`), which pulls Gyeonggi-do
open data (`openapi.gg.go.kr/GGCULTUREVENTSTUS`) and caches it in-process for 1 hour.
No database writes, no login. Secondary surface: the API itself (plain HTTP, curl).

All commands run from the repo root in **Git Bash**. Helpers live in
`.claude/skills/verify-today-art/scripts/` (below: `S=.claude/skills/verify-today-art/scripts`).

## Launch

```bash
S=.claude/skills/verify-today-art/scripts
$S/up.sh          # starts backend + frontend, waits until usable, runs doctor, prints EVIDENCE=<dir>
```

- Backend: `backend/dj_vv/Scripts/python.exe manage.py runserver 127.0.0.1:8000 --noreload`.
  Creates the venv (`py -3.13`) from `requirements.txt` if `backend/dj_vv` is missing.
  `backend/.env` is optional; without a `SECRET_KEY` there, up.sh exports a throwaway one.
  No migrations needed: the app has no models, the API never touches the DB.
- Frontend: `npm start` with `BROWSER=none PORT=3000` (`npm ci` first if `node_modules` is missing).
- Ready = backend `/` returns `Django is running`, frontend log says `compiled`, and
  `http://localhost:3000/` serves `id="root"`. Takes ~12 s warm, up to ~3 min cold.
- **Single instance only.** Ports are hardcoded: `setupProxy.js` → 8000, `API_BASE` default
  → 8000, CORS allows only origin `:3000`. up.sh refuses (exit 2) if 8000 or 3000 is already
  taken. Never drive or kill an instance you did not start — it may be the user's dev server.
- State: `.gstack/verify-run/state` (pids). Evidence: `.gstack/verify-evidence/<RUN_ID>/`.
  `.gstack/` is gitignored.

**Real data needs `OPEN_API_KEY` in `backend/.env`.** Without it the upstream API answers
`ERROR-290` (invalid key), every list is empty, and the calendar has no tags. Doctor prints
`DATA=0` + a WARN. Journeys that need data must then be reported as FAILED with that reason —
never weakened to pass. The empty result is cached for 1 h in the backend process, so after
adding the key run `down.sh` then `up.sh`.

## Doctor

```bash
$S/doctor.sh      # read-only; exit 0 = worth driving, 1 = not
```

Checks: state file exists (instance is ours), port 8000/3000 owners match recorded pids,
backend `/` answers, frontend serves index.html with no `Failed to compile`, and prints
`DATA=<n>` (entries from `/api/entries/?active=false&pSize=1`). Run it first whenever
anything looks off.

## Drive

Browser = gstack headless browser, pinned to its own tab by `$S/b.sh`
(`BROWSE_SESSION=verify-todayart`). Core commands:

```bash
$S/b.sh goto http://localhost:3000/          # navigate
$S/b.sh wait --networkidle                    # let API calls finish
$S/b.sh console --clear                       # once per run: the tab keeps logs across server restarts
$S/b.sh click '<css>' | fill '<css>' '<text>' | press Enter | hover '<css>'
$S/b.sh js '<expr>'                           # read DOM / localStorage / attributes
$S/b.sh url                                   # current URL (query string = filter state)
$S/b.sh network                               # requests made by the page (look for /api/)
$S/b.sh console --errors                      # console errors
$S/b.sh screenshot "$EV/<name>.png"
$S/b.sh snapshot -i                           # ARIA tree with @e refs for clicking
```

Stable handles in this repo (prefer these):

| What | Selector |
|---|---|
| Nav: home / calendar | `a[href="/"]`, `a[href="/calendar"]` (desktop only; mobile = `button[aria-label="메뉴 열기"]`) |
| Nav: theme | `button[aria-label="테마 선택"]` → `[role=dialog]` → `.themeModalButton[data-theme="<value>"]` |
| Theme values | `default`, `pink`, `white`, `dark`, `dark--green`, `dark--navy` (`src/contents/themeTokens.json`) |
| Theme result | `<html color-theme="...">` + `localStorage.theme` |
| Main search | `#mainSearchInput`, submit with `press Enter` |
| Category tags (home) | `.categoryTag` (전체, 공연, 행사, 교육, 전시) |
| Result cards | `.imgCard`, title `.imgCardTitle`; empty state text `결과가 없습니다.` |
| Sort (list) | `.customSelect__button` → `[role=option]` (정렬순, 최신순, 임박순) |
| Calendar | `.calendarBoard .calendarCell` (hover sets `.monthCell.is-active`), tags `.exhibitionTag` |

Filter state lives in the URL query (`term`, `cate`, `sort`, `startDate`, `endDate`, `title`,
`pIndex`), so assert with `$S/b.sh url` and the matching `/api/entries/?...` in `network`.

Feature recipes: `features/README.md` (index) and one file per feature.

## Evidence

Put every artifact in `$EV` (the `EVIDENCE=` path up.sh printed; also in
`.gstack/verify-run/state`): `EV=$(grep ^EVIDENCE= .gstack/verify-run/state | cut -d= -f2)`.

A proof contains:
1. Screenshot **before** and **after** the user action (`$EV/<feature>-before.png`, `-after.png`).
2. The resulting state read back, not only seen: URL query, `color-theme` attribute,
   `localStorage`, card count — saved to `$EV/<feature>.txt`.
3. The side effect: the API request in `$S/b.sh network` and the matching line in
   `.gstack/verify-run/backend.log` (copied to `$EV` by down.sh).
4. `$S/b.sh console --errors` output. Run `console --clear` before the journey. Known noise: React Router "Future Flag" warnings, `네트워크 에러: AbortError` (a fetch cancelled by navigation), and `ws://localhost:3000/ws` failures (dev server was restarted).

Drive the real user path (click, type, Enter). Do not call React setters, write
`localStorage` directly, or hit `/api/` with curl as a stand-in for a UI journey.
curl is fine only when the API itself is what you are verifying.

## Cleanup

```bash
$S/down.sh
```

Kills only the process trees recorded in state (`taskkill /T` on the recorded top pid —
never by process name), closes this skill's browser tab, copies `backend.log` /
`frontend.log` into `$EV`, deletes `.gstack/verify-run/`, and confirms ports are free.
Evidence in `.gstack/verify-evidence/<RUN_ID>/` is kept.

It also undoes the one file launch dirties: `frontend/public/index.html`. The `prestart`
hook rewrites `var allowed = {};` in place, and on an already-rewritten file it throws
(`index.html에서 'var allowed =' 구문을 찾지 못했습니다.`), so plain `npm start` fails on every
run after the first. up.sh handles it (skips the hook when only that line differs) and
down.sh restores the file only when it was clean before launch and that line is the only change.

## Helpers

| Script | Run | Does |
|---|---|---|
| `scripts/up.sh` | `$S/up.sh` | start both servers, wait, record pids, run doctor |
| `scripts/doctor.sh` | `$S/doctor.sh` | read-only health + `DATA=<n>` |
| `scripts/b.sh` | `$S/b.sh <browse cmd>` | headless browser on this skill's own tab |
| `scripts/down.sh` | `$S/down.sh` | stop our trees, keep evidence, restore index.html |
| `scripts/ptree.ps1` | used by up.sh | `<port-owner-pid> <top-pid>` for a listening port |
