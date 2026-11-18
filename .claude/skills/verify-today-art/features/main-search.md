# Main search

The user types a word on the home page and lands on the list page filtered by title.

## Sub-features

- `search-submit` Enter in `#mainSearchInput` navigates to `/list?term=<word>`.
- `search-empty` empty / whitespace input does not navigate.
- `search-results` list shows `.imgCard` items whose title contains the word, or `결과가 없습니다.`.
- `search-list` the list page's own search box (`.smallSearchInput` + `button[aria-label="검색"]`) refines the term.

## How to get to it (user POV)

- Home `/` → big search box `전시회를 검색해보세요` → type → Enter.
- List `/list` → header search box → type → search button.

## Driving it with b.sh

Preconditions: baseline. `search-results` with cards needs `DATA` > 0.

- **Home.** `$S/b.sh goto http://localhost:3000/`, `$S/b.sh wait --networkidle`, `$S/b.sh screenshot "$EV/search-before.png"`.
- **Type + Enter.** `$S/b.sh fill '#mainSearchInput' '전시'` then `$S/b.sh press Enter`, `$S/b.sh wait --networkidle`.
- **Assert route.** `$S/b.sh url` → `http://localhost:3000/list?term=%EC%A0%84%EC%8B%9C`.
- **Assert fetch.** `$S/b.sh network | grep /api/entries/` → `GET http://localhost:8000/api/entries/?term=%EC%A0%84%EC%8B%9C&pIndex=1&pSize=8 → 200`.
- **Assert results.** `$S/b.sh js '[...document.querySelectorAll(".imgCardTitle")].map(e=>e.textContent).join("\n")'`
  → every title contains `전시`. With DATA=0 the page shows `결과가 없습니다.` → report FAILED (no data), not pass.
- **Empty input.** Back on `/`, `$S/b.sh fill '#mainSearchInput' '   '`, `$S/b.sh press Enter` → `url` stays `/`.
- `$S/b.sh screenshot "$EV/search-after.png"`.

## Gotchas

- The magnifier button on the home search does **not** submit: `MainSearch.jsx` has
  `onClick={onSearch()}` (called during render, not on click). Use Enter. A fix should make the click work too.
- Default `active=true` on the backend keeps only exhibitions running today; a term that only matches
  past/future items returns nothing.
- Frontend caches pages in `sessionStorage` for 10 min (`entries:<qs>:p<n>:s<size>`); a repeat search may
  render without a new `/api/` request.
