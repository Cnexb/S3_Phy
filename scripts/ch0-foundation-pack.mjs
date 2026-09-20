import fs from "node:fs";
import path from "node:path";

const MANIFEST_RELATIVE = "content-packs/ch0-foundation/manifest.json";

export function loadCh0FoundationNotesPack(repoRoot) {
  const manifestPath = path.join(repoRoot, MANIFEST_RELATIVE);
  const pack = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

  if (pack.subject !== "PHY") {
    throw new Error("CH0 pack subject must be PHY");
  }
  if (pack.chapter !== "CH0 Foundation") {
    throw new Error("CH0 pack chapter label is wrong");
  }
  if (pack.scope !== "foundation") {
    throw new Error("CH0 pack scope must be foundation");
  }

  const codes = pack.notes.map((note) => note.topicCode);
  if (codes.join() !== "JPF01,JPF02") {
    throw new Error("CH0 notes must be JPF01 then JPF02");
  }

  for (const note of pack.notes) {
    if (note.files.zhHant) {
      throw new Error(`${note.topicCode} must not list a zhHant notes PDF`);
    }
    const relative = note.files.en;
    if (!relative.startsWith("content-packs/ch0-foundation/notes/")) {
      throw new Error(`${note.topicCode} en must live under the chapter pack notes/`);
    }
    const absolute = path.join(repoRoot, relative);
    if (!fs.existsSync(absolute) || !fs.statSync(absolute).isFile()) {
      throw new Error(`Missing note PDF: ${relative}`);
    }
  }

  return pack;
}
