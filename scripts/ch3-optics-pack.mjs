import fs from "node:fs";
import path from "node:path";

const MANIFEST_RELATIVE = "content-packs/ch3-wave-motion-and-optics/manifest.json";

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
    if (note.files.zhHant) {
      throw new Error(`${note.topicCode} must not list a zhHant notes PDF`);
    }
    const relative = note.files.en;
    if (!relative.startsWith("content-packs/ch3-wave-motion-and-optics/notes/")) {
      throw new Error(`${note.topicCode} en must live under the chapter pack notes/`);
    }
    const absolute = path.join(repoRoot, relative);
    if (!fs.existsSync(absolute) || !fs.statSync(absolute).isFile()) {
      throw new Error(`Missing note PDF: ${relative}`);
    }
  }

  const jpwm10 = pack.topics.find((topic) => topic.topicCode === "JPWM10");
  if (!jpwm10 || jpwm10.notes !== null) {
    throw new Error("JPWM10 must stay in the chapter with notes: null");
  }

  return pack;
}
