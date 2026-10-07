# Interview submissions (archive)

Record copies of interactive tools made by interviewees that are **not ready** for the live S3 Physics site.

This folder is independent of the teaching site:

- Not wired into the hub, labs, quizzes, worksheets, or Vite app
- Not copied by `npm run build:content`
- Not served under `public/`

Open files locally if you need to review them. Do not import these paths from `src/`, hub strands, quiz manifests, or lab packages.

## Naming

Use one folder per hand-in:

```text
YYYY-MM-DD-candidate-or-alias/task-slug/
```

Examples:

```text
2026-10-07-candidate-a/em-induction-tool/
2026-10-07-candidate-a/em-induction-tool/interactive-tool.html
2026-10-07-candidate-a/em-induction-tool/notes.md
```

Keep each submission self-contained (HTML and any notes or assets together).

## Optional static preview

If a submission needs a shareable browser link, put a **built** static copy under `public/interview-submissions/<same-path>/` so Vite/Pages can serve it. Keep the full source here. Do not wire previews into the hub.

## Related (separate)

The interview **brief** given to candidates lives under `exports/full-time-tutor-em-induction-sprint/` and is synced to `public/` for hosting. Do not put unfinished hand-ins there.
