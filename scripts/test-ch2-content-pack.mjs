import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { loadChapterNotesPack } from "./load-chapter-notes-pack.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const pack = loadChapterNotesPack(repoRoot, {
  manifestRelative: "content-packs/ch2-force-and-motion/manifest.json",
  subject: "PHY",
  chapter: "CH2 Force and Motion",
  scope: "mechanics",
  prefix: "content-packs/ch2-force-and-motion/notes/",
});

assert.equal(pack.notes.length, 13);
assert.equal(pack.notes[0].topicCode, "JPFM01");
assert.equal(pack.notes.at(-1).topicCode, "SPFM13");
console.log("all ch2 content-pack checks passed");
