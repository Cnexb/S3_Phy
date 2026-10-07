/**
 * A4 PDF for JPWM07 Light refraction Quiz 1.
 * Student questions first; the answer key starts on the next page.
 *
 * Usage: node scripts/export-jpwm07-quiz1-sheet.mjs
 */
import { execSync } from 'node:child_process';
import { copyFile, mkdir, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from 'playwright';

import { QUIZ_ITEMS } from '../quizzes/jpwm07/js/quizData.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'content', 'quiz-worksheets');
const assetsDir = path.join(outDir, 'assets');
const quizAssets = path.join(root, 'quizzes', 'jpwm07', 'assets');

const TITLE = 'JPWM07 Light refraction — Quiz 1';
const FILE_STEM = 'jpwm07-light-refraction-quiz1-questions';
const DESKTOP_NAME = 'JPWM07 Light refraction Quiz 1.pdf';

const PRINT_DOC_STYLE = `
@page { margin: 12mm; size: A4 portrait; }
* { box-sizing: border-box; }
html, body {
  margin: 0;
  padding: 0;
  min-height: 0 !important;
  height: auto !important;
  background: #fff;
}
body {
  font-family: Inter, "Segoe UI", sans-serif;
  font-size: 12pt;
  line-height: 1.45;
  color: #191c1e;
}
h1 { font-size: 18pt; margin: 0 0 0.35rem; }
.lead { font-size: 11pt; color: #414753; margin: 0 0 1.25rem; }
h2 { font-size: 13pt; margin: 0 0 0.5rem; }
p, ul { margin: 0.35em 0; }
ul { padding-left: 1.25rem; }
.export-q {
  margin-bottom: 1.15rem;
  page-break-inside: avoid;
  break-inside: avoid-page;
}
.answer-key {
  page-break-before: always;
  break-before: page;
}
.answer-key .guide {
  margin: 0.15rem 0 0.85rem;
}
.export-fig {
  page-break-inside: avoid;
  break-inside: avoid-page;
  margin: 0.75rem 0;
}
.export-fig img {
  max-width: 100%;
  height: auto;
  display: block;
}
.export-fig.ray img { max-width: 360px; }
.export-fig.liquid img { max-width: 340px; }
figcaption { font-size: 10pt; color: #414753; margin-top: 0.25rem; }
`;

function escHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function imageFileName(item) {
  const src = item.image?.src;
  if (!src) return '';
  return path.basename(String(src).split('?')[0]);
}

function figureClass(fileName) {
  if (fileName.includes('ray')) return 'ray';
  if (fileName.includes('liquid')) return 'liquid';
  return '';
}

function figureHtml(item) {
  const fileName = imageFileName(item);
  if (!fileName) return '';
  const cls = figureClass(fileName);
  const wrap = cls ? `export-fig ${cls}` : 'export-fig';
  return `<figure class="${wrap}">
<img src="./assets/${escHtml(fileName)}" alt="${escHtml(item.image.alt || '')}" />
<figcaption>${escHtml(item.image.caption || '')}</figcaption>
</figure>`;
}

function stemHtml(item) {
  return String(item.stem || '')
    .split('\n')
    .map((line) => `<p>${escHtml(line)}</p>`)
    .join('\n');
}

function answerLine(item) {
  const option = item.options?.find((opt) => opt.key === item.answer);
  if (option) return `${item.answer}. ${option.text}`;
  return String(item.answer ?? '');
}

function guideText(item) {
  return item.explanation || item.hint || '';
}

function itemHtml(item, index) {
  const options = (item.options || [])
    .map((opt) => `<li><b>${escHtml(opt.key)}.</b> ${escHtml(opt.text)}</li>`)
    .join('');
  return `<div class="export-q">
<h2>Q${index + 1} · ${escHtml(item.section)} · ${escHtml(item.difficulty)}</h2>
${stemHtml(item)}
${figureHtml(item)}
<ul>${options}</ul>
</div>`;
}

function answerKeyHtml() {
  const rows = QUIZ_ITEMS.map((item, index) => {
    return `<h2>Q${index + 1} · ${escHtml(item.section)}</h2>
<p><b>Answer:</b> ${escHtml(answerLine(item))}</p>
<p class="guide"><i>Guide:</i> ${escHtml(guideText(item))}</p>`;
  }).join('\n');
  return `<section class="answer-key">
<h1>${escHtml(TITLE)} · Answer key</h1>
<p class="lead">Teacher page · ${QUIZ_ITEMS.length} items</p>
${rows}
</section>`;
}

function sheetHtml() {
  const body = QUIZ_ITEMS.map((item, index) => itemHtml(item, index)).join('\n');
  return `<!DOCTYPE html>
<html lang="en" translate="no">
<head>
<meta charset="utf-8">
<meta name="google" content="notranslate">
<title>${escHtml(TITLE)}</title>
<style>${PRINT_DOC_STYLE}</style>
</head>
<body>
<h1>${escHtml(TITLE)}</h1>
<p class="lead">S3 Physics · ${QUIZ_ITEMS.length} multiple-choice items</p>
${body}
${answerKeyHtml()}
</body>
</html>
`;
}

async function launchBrowser() {
  try {
    return await chromium.launch({ headless: true });
  } catch {
    execSync('npx playwright install chromium', { cwd: root, stdio: 'inherit' });
    return chromium.launch({ headless: true });
  }
}

async function waitForImages(page) {
  await page.waitForFunction(() => [...document.images].every((img) => img.complete && img.naturalWidth > 0));
}

function copyTargets() {
  const home = os.homedir();
  const dirs = [
    path.join(home, 'Downloads'),
    path.join(home, 'Desktop'),
    path.join(home, 'OneDrive', 'Desktop'),
  ];
  return [...new Set(dirs)].map((dir) => path.join(dir, DESKTOP_NAME));
}

if (!QUIZ_ITEMS.length) throw new Error('No JPWM07 Quiz 1 items');

await mkdir(assetsDir, { recursive: true });
for (const item of QUIZ_ITEMS) {
  const fileName = imageFileName(item);
  if (!fileName) continue;
  await copyFile(path.join(quizAssets, fileName), path.join(assetsDir, fileName));
}

const html = sheetHtml();
const htmlPath = path.join(outDir, `${FILE_STEM}.html`);
const pdfPath = path.join(outDir, `${FILE_STEM}.pdf`);
await writeFile(htmlPath, html, 'utf8');

const browser = await launchBrowser();
const page = await browser.newPage();
await page.goto(pathToFileURL(htmlPath).href, { waitUntil: 'load' });
await waitForImages(page);
await page.pdf({
  path: pdfPath,
  format: 'A4',
  printBackground: true,
  preferCSSPageSize: true,
});
await page.close();
await browser.close();

for (const dest of copyTargets()) {
  try {
    await mkdir(path.dirname(dest), { recursive: true });
    await copyFile(pdfPath, dest);
    console.log(`Copied ${dest}`);
  } catch (err) {
    const alt = dest.replace(/\.pdf$/i, ' (with answer key).pdf');
    try {
      await copyFile(pdfPath, alt);
      console.warn(`Could not copy to ${dest}: ${err.message}`);
      console.log(`Copied ${alt}`);
    } catch (err2) {
      console.warn(`Could not copy to ${dest}: ${err.message}`);
      console.warn(`Could not copy to ${alt}: ${err2.message}`);
    }
  }
}

console.log(`Wrote content/quiz-worksheets/${FILE_STEM}.html`);
console.log(`Wrote content/quiz-worksheets/${FILE_STEM}.pdf`);
