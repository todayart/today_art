# Theme switch

The user picks a color theme from the nav; the page recolors at once and the choice survives reload.

## Sub-features

- `theme-open` opens the theme dialog from the nav.
- `theme-pick` applies one of 6 themes (`default`, `pink`, `white`, `dark`, `dark--green`, `dark--navy`).
- `theme-persist` keeps the theme after reload (`localStorage.theme`, applied by `public/index.html` before React boots).
- `theme-close` closes the dialog with `button[aria-label="테마 선택 모달 닫기"]` or a click on the overlay.

## How to get to it (user POV)

- Desktop: half-circle icon in the top-right nav (tooltip `테마 선택`), on any page.
- Mobile: hamburger `메뉴 열기` → theme item in the mobile menu.

## Driving it with b.sh

Preconditions: baseline. Needs no data.

- **Open.** `$S/b.sh goto http://localhost:3000/` then `$S/b.sh wait --networkidle`.
  `$S/b.sh js 'document.documentElement.getAttribute("color-theme")'` → note current value.
  `$S/b.sh screenshot "$EV/theme-before.png"`.
- **Open dialog.** `$S/b.sh click 'button[aria-label="테마 선택"]'`. `$S/b.sh is visible '[role=dialog]'` → `true`.
- **Pick.** `$S/b.sh click '.themeModalButton[data-theme="dark"]'`.
  `$S/b.sh js 'JSON.stringify({attr:document.documentElement.getAttribute("color-theme"),ls:localStorage.getItem("theme")})'`
  → `{"attr":"dark","ls":"dark"}`. `$S/b.sh screenshot "$EV/theme-after.png"` shows a dark background.
- **Persist.** `$S/b.sh reload`, then the same `js` read → still `dark`.
- **Reset.** Open the dialog again and click `data-theme="default"`, so later runs start clean.

## Gotchas

- Pick a theme different from the current one, or "after" proves nothing.
- Theme names allowed at boot come from the `var allowed = {...}` line that the `prestart` hook writes
  into `public/index.html`. A theme added to `themeTokens.json` without re-running the hook falls back
  to default on reload.
