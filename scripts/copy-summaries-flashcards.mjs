/**
 * Copy summary posters/PDFs and flashcard JSON/diagrams into chapter packs.
 * Hub public/ and content/flashcards/data stay unchanged.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicRoot = path.join(repoRoot, "public");
const jsonRoot = path.join(repoRoot, "content/flashcards/data");
const packsRoot = path.join(repoRoot, "content-packs");

const CHAPTERS = {
  "ch0-foundation": {
    posters: ["quantities-units", "useful-mathematics"],
    pdfs: [],
    json: ["flashcards-foundations.json"],
    diagrams: [],
  },
  "ch1-heat": {
    posters: ["thermometer", "heat-internal-energy", "change-of-state", "heat-transfer"],
    pdfs: [],
    json: ["flashcards-heat-ch1.json"],
    diagrams: ["thermometer", "heat-internal-energy", "change-of-state", "heat-transfer"],
  },
  "ch2-mechanics": {
    posters: [],
    pdfs: [],
    json: ["flashcards-mechanics.json"],
    diagrams: [],
  },
  "ch3-optics": {
    posters: ["reflection", "refraction", "tir", "convex", "concave", "em"],
    pdfs: ["reflection", "refraction", "tir", "convex", "concave", "em"],
    json: ["flashcards-light-ch3.json", "flashcards-optics-definitions.json"],
    diagrams: ["concave", "convex", "em", "optics-definitions"],
  },
};

function copyFile(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(from, to);
    else copyFile(from, to);
  }
}

function localeFiles(chapterDir, folder, base, ext) {
  return {
    en: `content-packs/${chapterDir}/${folder}/${base}-en.${ext}`,
    zhHant: `content-packs/${chapterDir}/${folder}/${base}-zhHant.${ext}`,
  };
}

for (const [chapterDir, spec] of Object.entries(CHAPTERS)) {
  const summariesDir = path.join(packsRoot, chapterDir, "summaries");
  const flashcardsDir = path.join(packsRoot, chapterDir, "flashcards");
  fs.mkdirSync(summariesDir, { recursive: true });
  fs.mkdirSync(flashcardsDir, { recursive: true });

  for (const base of spec.posters) {
    for (const locale of ["en", "zhHant"]) {
      copyFile(
        path.join(publicRoot, "summary", `${base}-${locale}.webp`),
        path.join(summariesDir, `${base}-${locale}.webp`),
      );
    }
  }
  for (const base of spec.pdfs) {
    for (const locale of ["en", "zhHant"]) {
      copyFile(
        path.join(publicRoot, "summary-pdfs", `${base}-${locale}.pdf`),
        path.join(summariesDir, `${base}-${locale}.pdf`),
      );
    }
  }
  for (const file of spec.json) {
    copyFile(path.join(jsonRoot, file), path.join(flashcardsDir, file));
  }
  for (const folder of spec.diagrams) {
    copyDir(path.join(publicRoot, "flashcards", folder), path.join(flashcardsDir, folder));
  }

  const manifestPath = path.join(packsRoot, chapterDir, "manifest.json");
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  manifest.summaries = spec.posters.map((id) => ({
    summaryId: id,
    images: localeFiles(chapterDir, "summaries", id, "webp"),
    pdfs: spec.pdfs.includes(id) ? localeFiles(chapterDir, "summaries", id, "pdf") : null,
  }));
  manifest.flashcards = spec.json.map((file) => ({
    file: `content-packs/${chapterDir}/flashcards/${file}`,
  }));
  fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log("copied", chapterDir);
}

console.log("summaries and flashcards copied into chapter packs");
