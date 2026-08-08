/**
 * Build a single-file HTML for the liquid thermometer design lab.
 * Usage: node scripts/export-thermometer-html.mjs [outPath]
 */
import { build } from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const outArg = process.argv[2];
const outPath = path.resolve(
  outArg || path.join(root, 'exports', 'thermometer-design-lab.html'),
);

const cssPaths = [
  path.join(root, 'labs', 'shared', 's3phy-embed.css'),
  path.join(root, 'labs', 'thermometer', 'styles.css'),
];

const css = cssPaths
  .map((p) => fs.readFileSync(p, 'utf8'))
  .join('\n\n');

const entry = path.join(root, 'labs', 'thermometer', 'js', 'boot.js');
const bundled = await build({
  entryPoints: [entry],
  bundle: true,
  write: false,
  format: 'iife',
  platform: 'browser',
  target: ['es2020'],
  // Drop ?v= query from imports inside boot.js
  plugins: [
    {
      name: 'strip-query',
      setup(buildApi) {
        buildApi.onResolve({ filter: /.*/ }, (args) => {
          if (!args.path.includes('?')) return null;
          const clean = args.path.split('?')[0];
          return {
            path: path.isAbsolute(clean)
              ? clean
              : path.resolve(args.resolveDir, clean),
          };
        });
      },
    },
  ],
});

const js = bundled.outputFiles[0].text;

const html = `<!DOCTYPE html>
<html lang="zh-HK">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>溫度計設計 — Thermometer Design Lab</title>
  <style>
${css}
  </style>
  <script>
    (function () {
      var params = new URLSearchParams(location.search);
      if (params.get('embed') === '1' || params.get('embed') === 'true') {
        document.documentElement.classList.add('s3phy-embed');
      }
      // Default to liquid design mode when opened as a standalone file
      if (!params.get('mode')) {
        params.set('mode', 'liquid');
        var next = location.pathname + '?' + params.toString() + location.hash;
        history.replaceState(null, '', next);
      }
    })();
  </script>
</head>
<body>
  <div id="app"></div>
  <script>
${js}
  </script>
</body>
</html>
`;

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, html, 'utf8');
console.log('Wrote', outPath, `(${(html.length / 1024).toFixed(1)} KB)`);
