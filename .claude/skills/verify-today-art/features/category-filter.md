# Category filter

The user picks a category (공연, 행사, 교육, 전시) and sees only that kind of event.

## Sub-features

- `category-home` category tag on the home page navigates to `/list?cate=<name>` (`전체` → `/list`).
- `category-list` the `카테고리` select in the list header changes `cate` in place.

## How to get to it (user POV)

- Home `/` → pill buttons under the search box.
- List `/list` → header `카테고리` dropdown (`.customSelect__button` in the filter header).

## Driving it with b.sh

Preconditions: baseline. Card check needs `DATA` > 0.

- **Home.** `$S/b.sh goto http://localhost:3000/`, `$S/b.sh wait --networkidle`.
- **Pick tag.** `$S/b.sh snapshot -i` and click the `전시` button by its `@e` ref, or
  `$S/b.sh js '[...document.querySelectorAll(".categoryTag button, .categoryTag")].map(e=>e.innerText)'` to locate it, then click.
- **Assert route.** `$S/b.sh url` → `/list?cate=%EC%A0%84%EC%8B%9C`; `network` shows `/api/entries/?cate=...`.
- **Assert results.** Every card belongs to 전시 (open a card or compare with
  `curl -s "http://127.0.0.1:8000/api/entries/?cate=전시&pSize=50"` → all `CATEGORY_NM` contain `전시`).
- **전체.** Click `전체` on home → `url` is `/list` with no `cate`.
- Screenshots `$EV/category-before.png`, `$EV/category-after.png`.

## Gotchas

- Backend matches `cate` as a substring of `CATEGORY_NM`, lowercased.
- `.categoryTag` markup: check `src/components/main/CategoryTag.jsx` if the selector misses; prefer the snapshot ref.
