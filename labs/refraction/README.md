# Refraction Lab (Snell’s Law)

Editable source for the Refraction interactive lab.

## Where to edit (on GitHub)

Edit files in this folder on GitHub (or clone the repo). This is the source of truth — the hub copies from `labs/refraction/` into `public/` on build.

- `index.html` — page shell + cache-busting
- `styles.css` — layout and theme
- `js/app.js` — main lab logic (rays, controls, microscopic model)
- `js/boot.js` — bootstrap / language bar
- `js/i18n.js` — English / Traditional Chinese strings

## How it is used

- Standalone: open `index.html` (dev server or GitHub Pages).
- Embedded in the Refraction / Optics Hub: iframe with `?embed=1&lang=en|zh&v=…`.

After editing, bump the `v=` cache-bust param if needed, run `npm run build`, and push.
