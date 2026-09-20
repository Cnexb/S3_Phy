/**
 * Content-pack seam: CH3 Optics notes manifest must point at real PDFs.
 * Does not call Cloudflare, Supabase, or UniPlus tracker.
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { loadCh3OpticsNotesPack } from "./ch3-optics-pack.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function check(name, fn) {
  fn();
  console.log("ok  " + name);
}

const pack = loadCh3OpticsNotesPack(repoRoot);

check("pack is PHY CH3 optics, not a per-topic pack", () => {
  assert.equal(pack.subject, "PHY");
  assert.equal(pack.chapter, "CH3 Wave Motion and Optics");
  assert.equal(pack.scope, "optics");
});

check("notes keys are CSV Topic codes JPWM01–11 plus hub JPWM04, without JPWM10", () => {
  assert.deepEqual(
    pack.notes.map((note) => note.topicCode),
    ["JPWM01", "JPWM02", "JPWM03", "JPWM04", "JPWM05", "JPWM06", "JPWM07", "JPWM08", "JPWM09", "JPWM11"],
  );
});

check("JPWM10 is listed without note files", () => {
  const jpwm10 = pack.topics.find((topic) => topic.topicCode === "JPWM10");
  assert.ok(jpwm10);
  assert.equal(jpwm10.notes, null);
});

check("every published note PDF exists on disk", () => {
  for (const note of pack.notes) {
    const filePath = path.join(repoRoot, note.files.en);
    assert.equal(note.files.zhHant, undefined, note.topicCode);
    assert.ok(
      note.files.en.startsWith("content-packs/ch3-wave-motion-and-optics/notes/"),
      note.topicCode,
    );
    assert.equal(fsExists(filePath), true, filePath);
  }
});

function fsExists(filePath) {
  try {
    return fs.statSync(filePath).isFile();
  } catch {
    return false;
  }
}

console.log("all ch3 content-pack checks passed");
