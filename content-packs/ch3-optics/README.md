# CH3 Optics notes pack (side branch)

**Do not merge this branch into `main`.** `main` stays the vendor Cloudflare deploy.

This pack is one **chapter** (CH3 Wave Motion and Optics), not one Topic. Hub files (`vite.config.js`, `src/`, `labs/`, `quizzes/`, `public/notes/`) stay in the repo so Pages still builds. All-In-One should read **this folder**, not the hub.

```
content-packs/ch3-optics/
  manifest.json
  notes/       bilingual PDFs keyed by Topic code
  comics/      later
  tools/       later (own html/js; not quizApp.js)
  quiz/        later (JSON only)
```

PDFs here are **copies**. `public/notes/` is unchanged.

## Published notes

| Topic | EN | ZH |
| --- | --- | --- |
| JPWM06 | `notes/JPWM06-en.pdf` | `notes/JPWM06-zhHant.pdf` |
| JPWM07 | `notes/JPWM07-en.pdf` | `notes/JPWM07-zhHant.pdf` |
| JPWM08 | `notes/JPWM08-en.pdf` | `notes/JPWM08-zhHant.pdf` |
| JPWM09 | `notes/JPWM09-en.pdf` | `notes/JPWM09-zhHant.pdf` |
| JPWM11 | `notes/JPWM11-en.pdf` | `notes/JPWM11-zhHant.pdf` |
| JPWM04 | `notes/JPWM04-en.pdf` | `notes/JPWM04-zhHant.pdf` |

JPWM10 is in the chapter but has no PDF. JPWM04 is Senior S4 in the CSV; it is listed because the Optics hub already ships those files.

## Check

```bash
node scripts/test-ch3-content-pack.mjs
```
