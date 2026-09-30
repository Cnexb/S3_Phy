/**
 * A4 PDF for JPHG02 Heat and internal energy Quiz 1.
 * Student questions first; last page is the answer key.
 *
 * Usage: node scripts/export-jphg02-quiz1-sheet.mjs
 */
import { execSync } from 'node:child_process';
import { copyFile, mkdir, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from 'playwright';

import { QUIZ_ITEMS } from '../quizzes/jphg02/js/quizData.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'content', 'quiz-worksheets');

const TITLE = 'JPHG02 Heat and internal energy — Quiz 1';
const FILE_STEM = 'jphg02-heat-internal-energy-quiz1-questions';
const DESKTOP_NAME = 'JPHG02 Heat and internal energy Quiz 1.pdf';

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
`;

function escHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
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

function copyTargets() {
  const home = os.homedir();
  const dirs = [
    path.join(home, 'Downloads'),
    path.join(home, 'Desktop'),
    path.join(home, 'OneDrive', 'Desktop'),
  ];
  return [...new Set(dirs)].map((dir) => path.join(dir, DESKTOP_NAME));
}

if (!QUIZ_ITEMS.length) throw new Error('No JPHG02 Quiz 1 items');

await mkdir(outDir, { recursive: true });
const html = sheetHtml();
const htmlPath = path.join(outDir, `${FILE_STEM}.html`);
const pdfPath = path.join(outDir, `${FILE_STEM}.pdf`);
await writeFile(htmlPath, html, 'utf8');

const browser = await launchBrowser();
const page = await browser.newPage();
await page.goto(pathToFileURL(htmlPath).href, { waitUntil: 'load' });
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
