/**
 * A4 PDFs for JPWM06 Light reflection Quiz 1–4.
 * Questions first; the answer key starts on the next page.
 *
 * Usage: node scripts/export-jpwm06-quiz-sheets.mjs
 */
import { execSync } from 'node:child_process';
import { copyFile, mkdir, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from 'playwright';

import { QUIZ_ITEMS as OPTICS_ITEMS } from '../quizzes/optics-ch3/js/quizData.js';
import { QUIZ_ITEMS as QUIZ2_ITEMS } from '../quizzes/jpwm06-2/js/quizData.js';
import { QUIZ_ITEMS as QUIZ3_ITEMS } from '../quizzes/jpwm06-3/js/quizData.js';
import { QUIZ_ITEMS as QUIZ4_ITEMS } from '../quizzes/jpwm06-4/js/quizData.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'content', 'quiz-worksheets');
const assetsDir = path.join(outDir, 'assets');

const JOBS = [
  {
    n: 1,
    items: OPTICS_ITEMS.filter((item) => item.topic === 'JPWM06'),
    assets: path.join(root, 'quizzes', 'optics-ch3', 'assets'),
    expected: 4,
  },
  {
    n: 2,
    items: QUIZ2_ITEMS,
    assets: path.join(root, 'quizzes', 'jpwm06-2', 'assets'),
    expected: 4,
  },
  {
    n: 3,
    items: QUIZ3_ITEMS,
    assets: path.join(root, 'quizzes', 'jpwm06-3', 'assets'),
    expected: 3,
  },
  {
    n: 4,
    items: QUIZ4_ITEMS,
    assets: path.join(root, 'quizzes', 'jpwm06-4', 'assets'),
    expected: 3,
  },
];

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
  max-height: 280px;
  height: auto;
  width: auto;
  display: block;
}
figcaption { font-size: 10pt; color: #414753; margin-top: 0.25rem; }
.options { list-style: none; padding-left: 0; }
.options li {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  margin: 0.35rem 0;
}
.opt-img {
  height: 72px;
  width: auto;
  flex: 0 0 auto;
}
`;

function escHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function fileNameFromSrc(src) {
  if (!src) return '';
  return path.basename(String(src).split('?')[0]);
}

function imageRefs(item) {
  const names = [];
  const stem = fileNameFromSrc(item.image?.src);
  if (stem) names.push(stem);
  for (const opt of item.options || []) {
    const name = fileNameFromSrc(opt.image);
    if (name) names.push(name);
  }
  return names;
}

function figureHtml(item) {
  const fileName = fileNameFromSrc(item.image?.src);
  if (!fileName) return '';
  return `<figure class="export-fig">
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

function optionsHtml(item) {
  return (item.options || [])
    .map((opt) => {
      const fileName = fileNameFromSrc(opt.image);
      const img = fileName
        ? `<img class="opt-img" src="./assets/${escHtml(fileName)}" alt="${escHtml(opt.text || opt.key)}" />`
        : '';
      return `<li><b>${escHtml(opt.key)}.</b> <span>${escHtml(opt.text)}</span>${img}</li>`;
    })
    .join('');
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
  const fig = figureHtml(item);
  const stem = stemHtml(item);
  const figureFirst = /\babove\b/i.test(item.stem || '');
  const body = figureFirst ? `${fig}\n${stem}` : `${stem}\n${fig}`;
  return `<div class="export-q">
<h2>Q${index + 1} · ${escHtml(item.section)} · ${escHtml(item.difficulty)}</h2>
${body}
<ul class="options">${optionsHtml(item)}</ul>
</div>`;
}

function answerKeyHtml(title, items) {
  const rows = items
    .map((item, index) => {
      return `<h2>Q${index + 1} · ${escHtml(item.section)}</h2>
<p><b>Answer:</b> ${escHtml(answerLine(item))}</p>
<p class="guide"><i>Guide:</i> ${escHtml(guideText(item))}</p>`;
    })
    .join('\n');
  return `<section class="answer-key">
<h1>${escHtml(title)} · Answer key</h1>
<p class="lead">Teacher page · ${items.length} items</p>
${rows}
</section>`;
}

function sheetHtml(title, items) {
  const body = items.map((item, index) => itemHtml(item, index)).join('\n');
  return `<!DOCTYPE html>
<html lang="en" translate="no">
<head>
<meta charset="utf-8">
<meta name="google" content="notranslate">
<title>${escHtml(title)}</title>
<style>${PRINT_DOC_STYLE}</style>
</head>
<body>
<h1>${escHtml(title)}</h1>
<p class="lead">S3 Physics · ${items.length} multiple-choice items</p>
${body}
${answerKeyHtml(title, items)}
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
  const pending = await page.locator('img').count();
  if (!pending) return;
  await page.waitForFunction(() => [...document.images].every((img) => img.complete && img.naturalWidth > 0));
}

function copyTargets(fileName) {
  const home = os.homedir();
  const downloadsFolder = path.join(home, 'Downloads', 'JPWM06 Quizzes');
  const dirs = [
    downloadsFolder,
    path.join(home, 'Desktop'),
    path.join(home, 'OneDrive', 'Desktop'),
  ];
  return [...new Set(dirs)].map((dir) => path.join(dir, fileName));
}

await mkdir(assetsDir, { recursive: true });

for (const job of JOBS) {
  if (job.items.length !== job.expected) {
    throw new Error(`JPWM06 Quiz ${job.n} expected ${job.expected} items, found ${job.items.length}`);
  }
  const copied = new Set();
  for (const item of job.items) {
    for (const fileName of imageRefs(item)) {
      if (copied.has(fileName)) continue;
      copied.add(fileName);
      await copyFile(path.join(job.assets, fileName), path.join(assetsDir, fileName));
    }
  }
}

const browser = await launchBrowser();

for (const job of JOBS) {
  const title = `JPWM06 Light reflection — Quiz ${job.n}`;
  const fileStem = `JPWM06 Quiz ${job.n}`;
  const htmlPath = path.join(outDir, `${fileStem}.html`);
  const pdfPath = path.join(outDir, `${fileStem}.pdf`);
  await writeFile(htmlPath, sheetHtml(title, job.items), 'utf8');

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

  for (const dest of copyTargets(`${fileStem}.pdf`)) {
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

  console.log(`Wrote content/quiz-worksheets/${fileStem}.html`);
  console.log(`Wrote content/quiz-worksheets/${fileStem}.pdf`);
}

await browser.close();
