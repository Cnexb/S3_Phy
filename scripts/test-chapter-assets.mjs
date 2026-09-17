/**
 * Chapter packs must hold comics, tools, quizzes, summaries, and flashcards next to notes.
 * Hub labs/, quizzes/, and public/ are left alone.
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const PACKS = [
  "content-packs/ch0-foundation/manifest.json",
  "content-packs/ch1-heat-and-gases/manifest.json",
  "content-packs/ch2-force-and-motion/manifest.json",
  "content-packs/ch3-wave-motion-and-optics/manifest.json",
  "content-packs/ch4-electricity-and-magnetism/manifest.json",
  "content-packs/ch5-radioactivity-and-nuclear-energy/manifest.json",
];

function exists(relative) {
  const absolute = path.join(repoRoot, relative);
  try {
    return fs.statSync(absolute).isFile() || fs.statSync(absolute).isDirectory();
  } catch {
    return false;
  }
}

function isFile(relative) {
  try {
    return fs.statSync(path.join(repoRoot, relative)).isFile();
  } catch {
    return false;
  }
}

function isDir(relative) {
  try {
    return fs.statSync(path.join(repoRoot, relative)).isDirectory();
  } catch {
    return false;
  }
}

for (const relative of PACKS) {
  const pack = JSON.parse(fs.readFileSync(path.join(repoRoot, relative), "utf8"));
  const chapterDir = path.posix.dirname(relative);

  assert.ok(Array.isArray(pack.comics), `${relative} comics`);
  assert.ok(Array.isArray(pack.tools), `${relative} tools`);
  assert.ok(Array.isArray(pack.quiz), `${relative} quiz`);

  assert.equal(isDir(`${chapterDir}/notes`), true, `${chapterDir}/notes`);
  assert.equal(isDir(`${chapterDir}/comics`), true, `${chapterDir}/comics`);
  assert.equal(isDir(`${chapterDir}/tools`), true, `${chapterDir}/tools`);
  assert.equal(isDir(`${chapterDir}/quiz`), true, `${chapterDir}/quiz`);
  assert.equal(isDir(`${chapterDir}/summaries`), true, `${chapterDir}/summaries`);
  assert.equal(isDir(`${chapterDir}/flashcards`), true, `${chapterDir}/flashcards`);
  assert.equal(isDir(`${chapterDir}/tools/shared`), true, `${chapterDir}/tools/shared`);

  assert.ok(Array.isArray(pack.summaries), `${relative} summaries`);
  assert.ok(Array.isArray(pack.flashcards), `${relative} flashcards`);

  for (const summary of pack.summaries) {
    for (const image of Object.values(summary.images)) {
      assert.ok(String(image).startsWith(`${chapterDir}/summaries/`), image);
      assert.equal(isFile(image), true, image);
    }
    if (summary.pdfs) {
      for (const pdf of Object.values(summary.pdfs)) {
        assert.ok(String(pdf).startsWith(`${chapterDir}/summaries/`), pdf);
        assert.equal(isFile(pdf), true, pdf);
      }
    }
  }

  for (const deck of pack.flashcards) {
    if (deck.file) {
      assert.ok(deck.file.startsWith(`${chapterDir}/flashcards/`), deck.file);
      assert.equal(isFile(deck.file), true, deck.file);
      continue;
    }
    assert.ok(Array.isArray(deck.sources) && deck.sources.length > 0, JSON.stringify(deck));
    for (const source of deck.sources) {
      const relative = source.file.startsWith(`${chapterDir}/`)
        ? source.file
        : `${chapterDir}/flashcards/${source.file.split("/").at(-1)}`;
      assert.equal(isFile(relative), true, relative);
    }
  }

  for (const comic of pack.comics) {
    for (const page of comic.pages) {
      assert.ok(page.startsWith(`${chapterDir}/comics/`), page);
      assert.equal(isFile(page), true, page);
    }
    if (comic.pdf) {
      assert.ok(comic.pdf.startsWith(`${chapterDir}/comics/`), comic.pdf);
      assert.equal(isFile(comic.pdf), true, comic.pdf);
    }
  }

  for (const tool of pack.tools) {
    assert.equal(tool.path, `${chapterDir}/tools/${tool.slug}`);
    assert.equal(isFile(`${tool.path}/index.html`), true, `${tool.path}/index.html`);
  }

  for (const quiz of pack.quiz) {
    assert.equal(quiz.path, `${chapterDir}/quiz/${quiz.slug}`);
    assert.equal(isFile(`${quiz.path}/quiz.html`), true, `${quiz.path}/quiz.html`);
    assert.equal(isFile(`${quiz.path}/manifest.json`), true, `${quiz.path}/manifest.json`);
  }

  console.log("ok  " + pack.scope + " chapter folders");
}

assert.equal(
  exists("content-packs/ch3-wave-motion-and-optics/comics/initial-d-gutter-run-1.webp"),
  true,
);
assert.equal(exists("content-packs/ch1-heat-and-gases/summaries/thermometer-en.webp"), true);
assert.equal(exists("content-packs/ch3-wave-motion-and-optics/summaries/reflection-en.pdf"), true);
assert.equal(
  exists("content-packs/ch3-wave-motion-and-optics/flashcards/flashcards-light-ch3.json"),
  true,
);
assert.equal(
  exists("content-packs/ch3-wave-motion-and-optics/flashcards/optics-definitions/convex1_p2_img2.png"),
  true,
);
assert.equal(exists("content-packs/ch5-radioactivity-and-nuclear-energy/notes/SPRN01-en.pdf"), true);
assert.equal(PACKS.length, 6);
console.log("all chapter asset checks passed");
