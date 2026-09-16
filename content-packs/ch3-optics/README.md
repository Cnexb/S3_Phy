# CH3 Wave Motion and Optics chapter pack (side branch)

**Do not merge this branch into `main`.** `main` stays the vendor Cloudflare deploy.

This pack is one **chapter**, not one Topic. Hub files (`vite.config.js`, `src/`, `labs/`, `quizzes/`, `public/`) stay so Pages still builds. All-In-One should read **this folder**, not the hub.

```
content-packs/ch3-optics/
  manifest.json
  notes/       bilingual PDFs keyed by Topic code
  comics/      Initial D: Gutter Run
  tools/       labs for waves + optics, plus shared embed CSS
  quiz/        optics-ch3, optics-ch4-em-wave
```

PDFs, comics, tools, and quizzes here are **copies**. Hub trees are unchanged.

## Published notes

| Topic | EN | ZH |
| --- | --- | --- |
| JPWM01 | `notes/JPWM01-en.pdf` | `notes/JPWM01-zhHant.pdf` |
| JPWM02 | `notes/JPWM02-en.pdf` | `notes/JPWM02-zhHant.pdf` |
| JPWM03 | `notes/JPWM03-en.pdf` | `notes/JPWM03-zhHant.pdf` |
| JPWM04 | `notes/JPWM04-en.pdf` | `notes/JPWM04-zhHant.pdf` |
| JPWM05 | `notes/JPWM05-en.pdf` | `notes/JPWM05-zhHant.pdf` |
| JPWM06 | `notes/JPWM06-en.pdf` | `notes/JPWM06-zhHant.pdf` |
| JPWM07 | `notes/JPWM07-en.pdf` | `notes/JPWM07-zhHant.pdf` |
| JPWM08 | `notes/JPWM08-en.pdf` | `notes/JPWM08-zhHant.pdf` |
| JPWM09 | `notes/JPWM09-en.pdf` | `notes/JPWM09-zhHant.pdf` |
| JPWM11 | `notes/JPWM11-en.pdf` | `notes/JPWM11-zhHant.pdf` |

JPWM10 is in the chapter but has no PDF. Hub `light-wave` is unpublished (JPWM04 already uses emwaves).

## Check

```bash
node scripts/test-ch3-content-pack.mjs
node scripts/test-chapter-assets.mjs
```
