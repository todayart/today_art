# Calendar

The user sees a 12-month board with each exhibition placed at the month it starts and ends.

## Sub-features

- `calendar-board` `/calendar` renders 12 month columns (`.monthCell`, January..December) for the current year.
- `calendar-tags` `.exhibitionTag` items per month from `GET /api/calendar/` (`"<n>m-start"`, `"<n>m-end"` keys).
- `calendar-hover` (desktop) hovering a column highlights its month header (`.monthCell.is-active`).
- `calendar-mobile` (mobile) month carousel with `button[aria-label="<n>월 이전|다음"]`.
- `calendar-status` loading / error / retry in `[role=status]`.

## How to get to it (user POV)

- Calendar icon in the top-right nav (`a[href="/calendar"]`), or open `/calendar` directly.

## Driving it with b.sh

Preconditions: baseline. Tags need `DATA` > 0.

- **Open.** `$S/b.sh goto http://localhost:3000/calendar`, `$S/b.sh wait --networkidle`, `$S/b.sh screenshot "$EV/calendar-before.png"`.
- **Board.** `$S/b.sh js 'document.querySelectorAll(".monthCell:not(.monthCell--spacer)").length'` → `12`.
- **Fetch.** `$S/b.sh network | grep /api/calendar/` → `200`.
- **Tags.** `$S/b.sh js 'document.querySelectorAll(".exhibitionTag").length'` → > 0. With DATA=0 it is `0` → report FAILED (no data).
- **Hover.** `$S/b.sh hover '.calendarBoard .calendarCell >> nth=3'` then
  `$S/b.sh js 'document.querySelector(".monthCell.is-active")?.innerText'` → a month name (index → month mapping is
  in `CalendarFixedCell.jsx`; assert the month, not the index).
- **Mobile.** `$S/b.sh viewport 390x844`, reload, click `button[aria-label="<current>월 다음"]` → `.monthCell.is-selected` moves one month.
  Restore with `$S/b.sh viewport 1280x720`.
- `$S/b.sh screenshot "$EV/calendar-after.png"`.

## Gotchas

- Desktop has **no** active month until hover; `.monthCell.is-active` is null on load.
- `/api/calendar/` groups by month number only, across years.
