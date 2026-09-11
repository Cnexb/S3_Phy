# CH3 Optics notes pack (side branch)

**Do not merge this branch into `main`.** `main` stays the vendor Cloudflare deploy.

This pack is one **chapter** (CH3 Wave Motion and Optics), not one Topic. Topics `JPWM06`–`JPWM11` live in this chapter. Each Topic may have Subtopics; notes are still **one bilingual PDF pair per Topic**.

PDFs stay at existing `public/notes/` paths. This branch does not move files.

## Published notes

| Topic | EN | ZH |
| --- | --- | --- |
| JPWM06 | `public/notes/jpwm06-light-reflection-en.pdf` | `public/notes/jpwm06-light-reflection-zhHant.pdf` |
| JPWM07 | `public/notes/refraction-en.pdf` | `public/notes/refraction-zhHant.pdf` |
| JPWM08 | `public/notes/tir-en.pdf` | `public/notes/tir-zhHant.pdf` |
| JPWM09 | `public/notes/convex-lens-en.pdf` | `public/notes/convex-lens-zhHant.pdf` |
| JPWM11 | `public/notes/concave-lens-en.pdf` | `public/notes/concave-lens-zhHant.pdf` |
| JPWM04 | `public/notes/emwaves-en.pdf` | `public/notes/emwaves-zhHant.pdf` |

JPWM10 is in the chapter but has no PDF. JPWM04 is Senior S4 in the CSV; it is listed because the Optics hub already ships those files.

## Check

```bash
node scripts/test-ch3-content-pack.mjs
```
