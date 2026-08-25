/**
 * Build a single-file HTML for the water heating / boiling-water lab.
 * Usage: node scripts/export-boiling-water-html.mjs [outPath]
 */
import { build } from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const outArg = process.argv[2];
const outPath = path.resolve(
  outArg || path.join(root, 'exports', 'water-heating-lab.html'),
);

const css = [
  path.join(root, 'labs', 'shared', 's3phy-embed.css'),
  path.join(root, 'labs', 'boiling-water', 'styles.css'),
]
  .map((p) => fs.readFileSync(p, 'utf8'))
  .join('\n\n');

const bundled = await build({
  entryPoints: [path.join(root, 'labs', 'boiling-water', 'app.js')],
  bundle: true,
  write: false,
  format: 'iife',
  platform: 'browser',
  target: ['es2020'],
});

const js = bundled.outputFiles[0].text;

const html = `<!DOCTYPE html>
<html lang="zh-HK" translate="no">
<head>
  <meta charset="UTF-8">
  <meta name="google" content="notranslate">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>煲水實驗 — Water Heating Lab</title>
  <style>
${css}

    .share-open {
      max-width: 720px;
      margin: 0 auto;
      padding: 48px 24px 32px;
      text-align: center;
    }
    .share-open h1 {
      margin: 0 0 12px;
      font-size: 1.8rem;
    }
    .share-open p {
      margin: 0 0 24px;
      color: #475569;
      line-height: 1.5;
    }
    .share-open a {
      display: inline-block;
      padding: 14px 28px;
      border-radius: 999px;
      background: #2563eb;
      color: #fff;
      font-weight: 800;
      text-decoration: none;
    }
    .share-open a:hover { background: #1d4ed8; }
    html:not(.lab-open) #app { display: none; }
    html.lab-open .share-open { display: none; }
  </style>
</head>
<body>
  <section class="share-open">
    <h1>煲水實驗 · Water Heating Lab</h1>
    <p>將呢個檔案傳送俾朋友。對方開啟檔案後，撳下面連結就可以開始實驗。</p>
    <p>Send this file to a friend. After opening it, click the link below to start the lab.</p>
    <a href="#lab" id="open-lab-link">開啟實驗 · Open the lab</a>
  </section>
  <div id="app"></div>
  <script>
    (function () {
      function openLab() {
        document.documentElement.classList.add('lab-open');
        if (location.hash !== '#lab') {
          history.replaceState(null, '', location.pathname + location.search + '#lab');
        }
      }
      document.getElementById('open-lab-link').addEventListener('click', function (event) {
        event.preventDefault();
        openLab();
      });
      if (location.hash === '#lab') openLab();
    })();
  </script>
  <script>
${js}
  </script>
</body>
</html>
`;

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, html, 'utf8');
console.log('Wrote', outPath, `(${(html.length / 1024).toFixed(1)} KB)`);
