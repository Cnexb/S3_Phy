import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { loadChapterNotesPack } from "./load-chapter-notes-pack.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const pack = loadChapterNotesPack(repoRoot, {
  manifestRelative: "content-packs/ch1-heat-and-gases/manifest.json",
  subject: "PHY",
  chapter: "CH1 Heat and Gases",
  scope: "heat",
  prefix: "content-packs/ch1-heat-and-gases/notes/",
});

assert.deepEqual(
  pack.notes.map((note) => note.topicCode),
  ["JPHG01", "JPHG02", "JPHG03", "JPHG04", "SPHG05", "SPHG05.5"],
);
console.log("all ch1 content-pack checks passed");
