import fs from "node:fs";
import path from "node:path";

export function loadChapterNotesPack(
  repoRoot,
  { manifestRelative, subject, chapter, scope, prefix },
) {
  const pack = JSON.parse(fs.readFileSync(path.join(repoRoot, manifestRelative), "utf8"));
  if (pack.subject !== subject) throw new Error(`${scope} pack subject must be ${subject}`);
  if (pack.chapter !== chapter) throw new Error(`${scope} pack chapter label is wrong`);
  if (pack.scope !== scope) throw new Error(`${scope} pack scope must be ${scope}`);
  for (const note of pack.notes) {
    if (note.files.zhHant) {
      throw new Error(`${note.topicCode} must not list a zhHant notes PDF`);
    }
    const relative = note.files.en;
    if (!relative.startsWith(prefix)) {
      throw new Error(`${note.topicCode} en must live under ${prefix}`);
    }
    const absolute = path.join(repoRoot, relative);
    if (!fs.existsSync(absolute) || !fs.statSync(absolute).isFile()) {
      throw new Error(`Missing note PDF: ${relative}`);
    }
  }
  return pack;
}
