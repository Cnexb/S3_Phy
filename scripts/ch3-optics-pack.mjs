import fs from "node:fs";
import path from "node:path";

const MANIFEST_RELATIVE = "content-packs/ch3-optics/manifest.json";

export function loadCh3OpticsNotesPack(repoRoot) {
  const manifestPath = path.join(repoRoot, MANIFEST_RELATIVE);
  const pack = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

  if (pack.subject !== "PHY") {
    throw new Error("CH3 pack subject must be PHY");
  }
  if (pack.chapter !== "CH3 Wave Motion and Optics") {
    throw new Error("CH3 pack chapter label is wrong");
  }
  if (pack.scope !== "optics") {
    throw new Error("CH3 pack scope must be optics");
  }

  for (const note of pack.notes) {
    for (const locale of ["en", "zhHant"]) {
      const relative = note.files[locale];
      if (!relative.startsWith("public/notes/")) {
        throw new Error(`${note.topicCode} ${locale} must stay under public/notes/`);
      }
      const absolute = path.join(repoRoot, relative);
      if (!fs.existsSync(absolute) || !fs.statSync(absolute).isFile()) {
        throw new Error(`Missing note PDF: ${relative}`);
      }
    }
  }

  const jpwm10 = pack.topics.find((topic) => topic.topicCode === "JPWM10");
  if (!jpwm10 || jpwm10.notes !== null) {
    throw new Error("JPWM10 must stay in the chapter with notes: null");
  }

  return pack;
}
