# ⚛️ Uni+

**An Interactive Learning Hub for HKDSE S3 Physics**

[Made with JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[CSS3](https://www.w3.org/Style/CSS/)
[HTML5](https://developer.mozilla.org/en-US/docs/Web/HTML)

*Master Physics. Visually & Instantly.*

---

## ✨ Features

### 🧭 Dual-Strand Hub

- **Optics** and **Heat** strands for HKDSE Secondary 3 Physics
- Entry splash → strand picker → shared hub navigation
- Seven sections in every strand: **Topics**, **Notes**, **Tools**, **Worksheets**, **Quiz**, **Flashcards**, **Summary**
- UI in **English** and **Traditional Chinese** (persisted in browser)
- Deep links: `#/optics` and `#/heat`

### 🔭 Optics — Light & Waves

Topics: reflection, refraction, total internal reflection, convex and concave lenses, electromagnetic waves.

| Lab | Description |
| --- | --- |
| **Rotating Mirror** | Explore image rotation with a rotating plane mirror |
| **Plane Mirror Lab** | Interactive image formation with a plane mirror |
| **3D Reflection Lab** | 3D simulation of regular and diffuse reflection with filling medium |
| **Refraction / TIR** | Snell's law and a total-internal-reflection escape challenge |
| **Lens Lab** | Convex and concave lens ray diagrams |
| **RGB Color Mixer** | Additive colour mixing with red, green, and blue light |
| **EM Spectrum** | Electromagnetic wave spectrum explorer |

- **Worksheets:** Light & Lens, EM Wave
- **Quiz:** Optics Ch.3 quiz
- **Flashcards:** 111 cards combined (73 light + 38 definitions), filterable by reflection, refraction/TIR, convex, concave, and EM

### 🌡️ Heat — Temperature & Thermal Physics

Topics: thermometer, heat and internal energy, change of state, heat transfer.

| Lab | Description |
| --- | --- |
| **Faulty Calibration** | Correct a thermometer with a wrong scale |
| **Liquid Thermometer** | Liquid-in-glass thermometer simulation |
| **Resistance Thermometer** | Resistance-based temperature sensing |
| **Thermistor** | Thermistor temperature response |
| **Specific Heat** | Heating curves and specific heat capacity |
| **Thermal Mixing** | Mix hot and cold substances |
| **Change of State** | Melting, boiling, and latent heat |
| **Heat Transfer** | Conduction, convection, and radiation |

- **Worksheets:** F3 Heat final exam practice
- **Quiz:** Heat Ch.1 quiz
- **Flashcards:** 116 cards across thermometry, heat & internal energy, change of state, and heat transfer

### 📚 Shared Learning Assets

- **PDF notes** in `public/notes/` (English and Traditional Chinese pairs)
- **Summary posters** in `public/summary/` (bilingual `.webp` images)
- **Embedded quizzes** in `public/*-quiz/` folders with print-ready PDF/Word export
- Missing note files show a friendly notice instead of a broken embed

---

## 🆕 Recent Updates (July 2026)

- Performance optimization, Optics lab cleanup, and dead-code removal
- Improved responsive layout for iPad and tablets
- Worksheet PDF and Word export fixes: blank pages, missing figures, and page breaks
- Heat summary posters evenly distributed across full width
- Heat worksheet no longer auto-generates on load

---

## 🚀 Quick Start

### Local Development

```bash
# Clone the repository
git clone https://github.com/unipluseducationact-ctrl/S3_Phy.git

# Navigate to project directory
cd S3_Phy

# Install dependencies
npm install

# Start dev server (with hot reload)
npm run dev
```

Open **http://localhost:5173/** (Vite dev).

### Production Build

```bash
# Build static files to dist/ (includes plane-mirror-lab bundle step)
npm run build

# Rebuild Plane Mirror Lab only (labs/plane-mirror-lab → public/plane-mirror-lab)
npm run build:plane-mirror-lab

# Preview production build locally
npm run preview
```

Preview serves the production build (usually **http://localhost:4173/**).

### Content Export Scripts (Maintainers)

```bash
npm run export:heat-flashcards
npm run export:light-flashcards
npm run export:optics-definitions-flashcards
```

---

## 🌐 Live Site & Deployment

**Live URL:** `https://cnexb.github.io/S3_Phy/`

Light → Comics (Initial D): open the live site, choose Light, then **6. Comics**.

### Why the page was blank

GitHub was serving the **repository root** `index.html`, which loads `/src/main.js` for Vite dev. That file is not bundled for static hosting, so the app stayed empty.

**Fixes in this repo:**

1. **`dist/` is committed** with the production build.
2. **Root `index.html`** includes a redirect script that sends `*.github.io` visitors from `/S3_PHY/` to `/S3_PHY/dist/` until Pages points at `/dist` or Actions.
3. **`base: './'`** in `vite.config.js` so `./assets/...` works under `/S3_PHY/dist/` and when `/dist` contents are mapped to the site root.

**Option A — GitHub Actions (recommended):** Settings → Pages → **Source: GitHub Actions**. The workflow in `.github/workflows/deploy-pages.yml` builds `dist/` and deploys via `upload-pages-artifact` + `deploy-pages`. Do **not** also use “Deploy from branch → `/dist`” — that second source races with Actions and causes intermittent deployment failures.

**Option B — Branch + `/dist` on `main`:** Settings → Pages → **Deploy from a branch** → Branch **`main`**, folder **`/dist`**. Disable or delete the GitHub Actions deploy workflow if you use this option only.

### Adding PDF Notes

Place files under `public/notes/` (see `public/notes/README.txt` for naming conventions).

---

## 📁 Project Structure

```
S3_Phy/
├── .github/workflows/deploy-pages.yml  # GitHub Pages CI deploy
├── package.json                        # npm scripts (dev, build, build:content, exports)
├── index.html                          # Dev entry + GitHub Pages redirect
├── vite.config.js                      # base: './'
├── dist/                               # Committed production build
├── labs/                               # Interactive lab source packages
│   ├── */manifest.json                 # slug, build script, sync rules → public/
│   └── plane-mirror-lab/               # Bundled separately (build:plane-mirror-lab)
├── quizzes/                            # Embedded quiz source packages
│   └── */manifest.json                 # build + sync → public/*-quiz/
├── worksheets/                         # Worksheet source packages
│   └── */manifest.json                 # build + sync → public/
├── content/
│   └── flashcards/
│       └── data/                       # flashcards-*.json decks (imported by src/)
├── public/                             # Static assets served by Vite / GitHub Pages
│   ├── notes/                          # Bilingual PDF notes
│   ├── summary/                        # Bilingual summary posters
│   ├── flashcards/                     # Flashcard image assets
│   └── */                              # Labs, quizzes, worksheets (from build:content)
├── scripts/
│   ├── build-content.cjs               # Sync labs/, quizzes/, worksheets/ → public/
│   └── export-*-flashcards.*           # Regenerate content/flashcards/data/
├── src/                                # Hub app (Vite entry)
│   ├── main.js                         # App entry and hash routing
│   ├── hubShell.js                     # Shared hub navigation shell
│   ├── strandHub.js                    # Strand picker after splash
│   ├── i18n.js                         # English / Traditional Chinese
│   ├── locales/                        # en.js, zhHant.js
│   ├── strands/                        # opticsHub.js, heatHub.js
│   ├── tools/                          # Lab iframe loaders (point at public/)
│   ├── worksheets/                     # Worksheet and quiz embed wiring
│   └── flashcards/                     # Study UI and session logic
└── README.md
```

### Build pipeline

1. **`npm run build:content`** — reads `manifest.json` in each package under `labs/`, `quizzes/`, and `worksheets/`, runs optional build scripts, and copies output into matching folders under `public/`.
2. **`npm run build`** — runs `build:content`, then `vite build` to produce `dist/` for deployment.
3. **Flashcard decks** live in `content/flashcards/data/` and are imported directly by the Vite app (not copied by `build:content`).

See [CONTRIBUTING.md](CONTRIBUTING.md) for setup and PR workflow.

---

## 🎨 Design Philosophy

Uni+ follows modern design principles:

- **Minimal & Clean** — Strand-first hub with focused navigation
- **Responsive** — Mobile through tablet and desktop, including iPad layouts
- **Bilingual** — English and Traditional Chinese across UI, notes, and flashcards
- **Interactive First** — Labs, worksheets, and flashcards over rote memorization
- **Micro-animations** — Smooth, delightful interactions on splash and hub transitions

---

## 🎓 Target Audience

- **HKDSE Secondary 3 Physics students**
- **Teachers** looking for labs, worksheets, flashcards, and summary posters
- **Self-learners** reviewing Optics and Heat topics
- **Anyone** interested in visual physics learning

---

## 🛡️ License

This project is created for educational purposes. Unauthorized copying, modification, or redistribution without explicit permission is prohibited.

---

## 🙏 Acknowledgments

- **Vite** — Fast build tooling and dev server
- **Google Fonts (Inter, Montserrat)** — Typography
- **The Physics Education Community** — For inspiration

---

**Built with ❤️ and lots of ☕**

*Stop memorizing — start visualizing.*

[Buy Me A Coffee](https://buymeacoffee.com/uniplus)
