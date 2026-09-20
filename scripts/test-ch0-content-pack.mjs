import assert from "node:assert/strict";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { loadCh0FoundationNotesPack } from "./ch0-foundation-pack.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function check(name, fn) {
  fn();
  console.log("ok  " + name);
}

const pack = loadCh0FoundationNotesPack(repoRoot);

check("pack is PHY CH0 foundation, not a per-topic pack", () => {
  assert.equal(pack.subject, "PHY");
  assert.equal(pack.chapter, "CH0 Foundation");
  assert.equal(pack.scope, "foundation");
});

check("notes keys are CSV Topic codes JPF01 and JPF02", () => {
  assert.deepEqual(
    pack.notes.map((note) => note.topicCode),
    ["JPF01", "JPF02"],
  );
});

check("every published note PDF exists on disk", () => {
  for (const note of pack.notes) {
    const filePath = path.join(repoRoot, note.files.en);
    assert.equal(note.files.zhHant, undefined);
    assert.ok(note.files.en.startsWith("content-packs/ch0-foundation/notes/"));
    assert.equal(fs.existsSync(filePath), true, filePath);
  }
});

console.log("all ch0 content-pack checks passed");
