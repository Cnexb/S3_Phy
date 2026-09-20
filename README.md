# Physics content packs

This repo is the Physics teaching files for **Uni+ (All-In-One)**. Students do not open this site. Uni+ reads the `content-packs/` folder and shows notes, tools, quizzes, and the rest in Learning Tools.

## How Uni+ finds content

Each **textbook chapter** is one folder. Uni+ only looks **one level** under `content-packs/`:

```
content-packs/
  ch0-foundation/
    manifest.json          ← required. If this file is valid and published, Uni+ can list the chapter
    notes/                 ← English PDFs only (繁體 UI still opens this file)
    tools/                 ← interactive labs (keep index.html here)
    quiz/
    summaries/
    comics/
    flashcards/
  ch1-heat-and-gases/
  ch2-force-and-motion/
  ch3-wave-motion-and-optics/
  ch4-electricity-and-magnetism/
  ch5-radioactivity-and-nuclear-energy/
```

`manifest.json` is the table of contents. **A file that is not listed there is invisible** in Uni+.

Do **not** wrap chapters in year folders such as `content-packs/S3/…` or `content-packs/S4/…`. Uni+ will not see them.

## S1–S6 is a label on a Topic, not a folder

The syllabus list is `content/topics/physics-topics.json`. Each Topic has:

- a **Symbol** (short code), e.g. `HG01`, `HG05`
- a **Topic Number**, e.g. `JPHG01`, `SPHG05`
- a **Level**, e.g. `(S3)` or `(S4)`
- a **Textbook Chapter** heading, e.g. `CH1 Heat and Gases`

One chapter folder can hold Topics from **more than one year**. That is normal:

| Folder | Examples | Level |
| --- | --- | --- |
| `ch1-heat-and-gases` | `HG01`–`HG04` heat | S3 |
| same folder | `HG05` gases | S4 |
| `ch3-wave-motion-and-optics` | mirrors and lenses | S3 |
| same folder | waves | S4 |

So we do **not** copy the whole of CH1 into both `S3/` and `S4/`. We keep one CH1 pack and tag each note/tool with its Symbol.

## How different classes get different content

Form (S1 vs S6) is **not** chosen by folder name. In Uni+:

1. Students are in a **Course** (today: 數理AI應用特別課程 A or B; later Regular / Intensive). A and B are the same Physics Topic list, taught at a different pace.
2. A teacher sets that class’s **current Topic** (for example “we are on `HG04` this week”).
3. Students then see that Topic plus earlier Topics in syllabus order — not every published pack at once.

Until that class pin is live in Uni+, only set `"published": true` on packs you are happy for every Physics student to see. Use `"published": false` for unfinished or later-year drafts.

## Add S1, S2, or S4–S6 content

1. Copy an existing chapter folder. Rename it, e.g. `ch6-astronomy-and-space-science`.
2. Edit `manifest.json`: `subject` `"PHY"`, a unique lowercase `scope` (e.g. `astronomy`), `chapterCode`, titles in English and 繁體.
3. Add Topics using Symbols from `physics-topics.json`. Put Level on the Topic in that JSON (and in the CSV syllabus). Do not invent new Symbols.
4. Add `notes[]` / `tools[]` / `quiz[]` rows that point at the new files.
5. Set `"published": true` when it should appear in Uni+.

Same chapter, extra year (like gases in CH1): **do not** make a second folder. Add another Topic row (`HG05`) inside `ch1-heat-and-gases`.

Two classes at the same form with different speed (A vs B): **do not** duplicate folders. Uni+ uses the class’s current Topic.

## What teachers edit

| You want to change | Edit |
| --- | --- |
| Which items appear | that chapter’s `manifest.json` |
| Notes | one English `notes/*-en.pdf` per Topic (`files.en` only — do not add `*-zhHant.pdf`) |
| A lab | `tools/<slug>/` (keep `index.html`) and the `tools` list |
| A quiz | `quiz/<slug>/js/quizData.js` and the `quiz` list |
| Topic codes / year | `content/topics/physics-topics.json` |

Cursor follows `.cursor/rules/phy-content-packs.mdc`.

```bash
npm test
```
