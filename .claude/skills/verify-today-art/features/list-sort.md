# List sort

On the list page the user reorders results: 최신순 (newest start first) or 임박순 (ending soonest first).

## Sub-features

- `sort-pick` choosing an option writes `sort` into the URL and refetches.
- `sort-order` cards come back in that order.
- `sort-reset` `정렬순` removes `sort`.

## How to get to it (user POV)

- `/list` → dropdown at the top right of the results (`정렬순`).

## Driving it with b.sh

Preconditions: baseline. Order check needs `DATA` >= 2.

- **Open list.** `$S/b.sh goto http://localhost:3000/list`, `$S/b.sh wait --networkidle`, `$S/b.sh screenshot "$EV/sort-before.png"`.
- **Open dropdown.** `$S/b.sh click '.customSelect__button'` (on `/list` the first one is the sort select).
  `$S/b.sh js '[...document.querySelectorAll("[role=option]")].map(o=>o.innerText).join(",")'` → `정렬순,최신순,임박순`.
- **Pick 최신순.** `$S/b.sh click '[role=option]:nth-child(2)'`.
- **Assert.** `$S/b.sh url` → `/list?sort=-begin_de&pIndex=1`; `network` → `GET .../api/entries/?sort=-begin_de&pIndex=1&pSize=8 → 200`.
- **Assert order.** `$S/b.sh js '[...document.querySelectorAll(".imgCardPeriod")].map(e=>e.textContent).join("\n")'`
  → start dates non-increasing. With DATA=0 report FAILED (no data).
- **임박순.** Same with option 3 → `sort=end_de`, end dates non-decreasing.
- `$S/b.sh screenshot "$EV/sort-after.png"`.

## Gotchas

- Mapping lives in `src/contents/sortOption.js` (`최신순: "-begin_de"`, `임박순: "end_de"`).
- With a category/date filter in the header there are several `.customSelect__button`s; locate the sort
  one inside `.sortSelectArea`.
