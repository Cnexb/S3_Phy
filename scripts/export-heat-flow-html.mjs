/**
 * Build a single-file HTML for the heat flow / thermal equilibrium lab.
 * Usage: node scripts/export-heat-flow-html.mjs [outPath]
 */
import { build } from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const require = createRequire(import.meta.url);

function resolveEsbuild() {
  try {
    return require.resolve('esbuild');
  } catch {
    const nested = path.join(root, 'node_modules', 'vite', 'node_modules', 'esbuild', 'lib', 'main.js');
    if (fs.existsSync(nested)) return nested;
    throw new Error('esbuild not found. Run npm install first.');
  }
}

resolveEsbuild();

const outArg = process.argv[2];
const outPath = path.resolve(
  outArg || path.join(root, 'exports', 'heat-flow-lab.html'),
);

const css = [
  path.join(root, 'labs', 'shared', 's3phy-tokens.css'),
  path.join(root, 'labs', 'shared', 's3phy-embed.css'),
  path.join(root, 'labs', 'heat-flow', 'styles.css'),
]
  .map((p) => fs.readFileSync(p, 'utf8'))
  .join('\n\n');

const bundled = await build({
  entryPoints: [path.join(root, 'labs', 'heat-flow', 'js', 'boot.js')],
  bundle: true,
  write: false,
  format: 'iife',
  platform: 'browser',
  target: ['es2020'],
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
<html lang="zh-HK" translate="no">
<head>
  <meta charset="UTF-8">
  <meta name="google" content="notranslate">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>熱能流動與熱平衡 — Heat Flow Lab</title>
  <style>
${css}
  </style>
  <script>
    (function () {
      var params = new URLSearchParams(location.search);
      if (params.get('embed') === '1' || params.get('embed') === 'true') {
        document.documentElement.classList.add('s3phy-embed');
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
