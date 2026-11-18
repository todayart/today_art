# today_art verification map

Maintained source for proving user-facing behavior of today_art. Read this index, then use
the matching feature file as the recipe.

## Baseline preconditions

- Started by `$S/up.sh` (`S=.claude/skills/verify-today-art/scripts`), and `$S/doctor.sh` exits 0.
- `EV=$(grep ^EVIDENCE= .gstack/verify-run/state | cut -d= -f2)` is set.
- Desktop viewport (default 1280x720). Mobile layout starts below the `useMobile` breakpoint
  and swaps the nav for `button[aria-label="메뉴 열기"]`; run `$S/b.sh viewport 390x844` to drive it.
- Data journeys need `DATA` > 0 from doctor (requires `OPEN_API_KEY` in `backend/.env`).
  With `DATA=0` report them FAILED: "no upstream data (OPEN_API_KEY missing)".
- Theme persists in `localStorage`. To start from the default theme, open the theme modal and
  pick `default` through the UI.

## Features

| ID | File | Needs data |
|---|---|---|
| `theme` | [theme-switch.md](theme-switch.md) | no |
| `search` | [main-search.md](main-search.md) | for result cards |
| `category` | [category-filter.md](category-filter.md) | for result cards |
| `sort` | [list-sort.md](list-sort.md) | for order check |
| `calendar` | [calendar.md](calendar.md) | for tags |

## Proof and skip reporting

- Before + after screenshots in `$EV`, named `<feature-id>-<step>.png`.
- Read back the state (URL query, attributes, localStorage, counts) into `$EV/<feature-id>.txt`.
- Name the `/api/` request seen in `$S/b.sh network` for every action that fetches.
- Report an unreachable path with the command tried and the unmet precondition.
