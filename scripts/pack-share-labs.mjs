/**
 * Pack refraction, TIR, and heat-transfer labs as double-clickable HTML
 * plus a zip for sharing.
 *
 * Usage: node scripts/pack-share-labs.mjs
 */
import { build } from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
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

const stripQueryPlugin = {
  name: 'strip-query',
  setup(buildApi) {
    buildApi.onResolve({ filter: /.*/ }, (args) => {
      if (!args.path.includes('?')) return null;
      const clean = args.path.split('?')[0];
      return {
        path: path.isAbsolute(clean) ? clean : path.resolve(args.resolveDir, clean),
      };
    });
  },
};

async function bundleRefraction() {
  const css = [
    path.join(root, 'labs', 'shared', 's3phy-embed.css'),
    path.join(root, 'labs', 'refraction', 'styles.css'),
  ]
    .map((p) => fs.readFileSync(p, 'utf8'))
    .join('\n\n');

  const bundled = await build({
    entryPoints: [path.join(root, 'labs', 'refraction', 'js', 'boot.js')],
    bundle: true,
    write: false,
    format: 'iife',
    platform: 'browser',
    target: ['es2020'],
    plugins: [stripQueryPlugin],
  });

  return `<!DOCTYPE html>
<html lang="zh-HK" translate="no">
<head>
  <meta charset="UTF-8">
  <meta name="google" content="notranslate">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Refraction Lab — Snell's Law</title>
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
${bundled.outputFiles[0].text}
  </script>
</body>
</html>
`;
}

function inlineTir() {
  const tokens = fs.readFileSync(path.join(root, 'labs', 'shared', 's3phy-tokens.css'), 'utf8');
  const embedCss = fs.readFileSync(path.join(root, 'labs', 'shared', 's3phy-embed.css'), 'utf8');
  const embedInit = fs.readFileSync(path.join(root, 'labs', 'shared', 's3phy-embed-init.js'), 'utf8');
  let html = fs.readFileSync(path.join(root, 'labs', 'tir-escape', 'index.html'), 'utf8');
  const injected = `<style>\n${tokens}\n\n${embedCss}\n</style>\n    <script>\n${embedInit}\n    </script>`;
  const replaced = html.replace(
    /<link rel="stylesheet" href="\.\.\/shared\/s3phy-tokens\.css">\s*<link rel="stylesheet" href="\.\.\/shared\/s3phy-embed\.css">\s*<script src="\.\.\/shared\/s3phy-embed-init\.js"><\/script>/,
    injected,
  );
  if (replaced === html) {
    throw new Error('Could not inline TIR shared CSS/JS — markup may have changed.');
  }
  return replaced;
}

const launcher = `<!DOCTYPE html>
<html lang="zh-HK" translate="no">
<head>
  <meta charset="UTF-8">
  <meta name="google" content="notranslate">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>S3 Physics Labs</title>
  <style>
    :root { color-scheme: light; }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      font-family: "Segoe UI", "Noto Sans TC", system-ui, sans-serif;
      background: #f8f9fa;
      color: #1a1c2c;
    }
    main {
      max-width: 720px;
      margin: 0 auto;
      padding: 48px 24px 64px;
    }
    h1 { margin: 0 0 8px; font-size: 1.85rem; }
    .lead { margin: 0 0 28px; color: #6b7280; line-height: 1.55; }
    a.lab {
      display: block;
      margin: 0 0 12px;
      padding: 18px 20px;
      border-radius: 14px;
      background: #fff;
      border: 1px solid #e8eaed;
      text-decoration: none;
      color: inherit;
      box-shadow: 0 2px 12px rgba(26, 28, 44, 0.06);
    }
    a.lab:hover { border-color: #2563eb; }
    a.lab strong { display: block; font-size: 1.12rem; color: #2563eb; margin-bottom: 4px; }
    a.lab span { color: #6b7280; font-size: 0.95rem; }
    .note { margin-top: 28px; font-size: 0.9rem; color: #6b7280; line-height: 1.5; }
  </style>
</head>
<body>
  <main>
    <h1>S3 Physics Labs</h1>
    <p class="lead">撳下面就可以開啟實驗。Double-click a lab to open it in your browser.</p>
    <a class="lab" href="refraction-lab.html">
      <strong>折射實驗 · Refraction Lab</strong>
      <span>Snell's law, media, and total internal reflection</span>
    </a>
    <a class="lab" href="total-internal-reflection-lab.html">
      <strong>全反射逃獄 · Total Internal Reflection</strong>
      <span>Critical angle and TIR escape game</span>
    </a>
    <a class="lab" href="heat-transfer-lab.html">
      <strong>熱傳遞實驗 · Heat Transfer Lab</strong>
      <span>Conduction, convection, and radiation</span>
    </a>
    <p class="note">Heat Transfer 同全反射實驗需要網絡（字型／圖表／公式）。折射實驗可以離線開啟。<br>Heat Transfer and TIR need internet. The refraction lab works offline.</p>
  </main>
</body>
</html>
`;

const packDir = path.join(root, 'exports', '_share-pack', 'S3-Phy-Labs');
fs.rmSync(path.dirname(packDir), { recursive: true, force: true });
fs.mkdirSync(packDir, { recursive: true });

const refractionHtml = await bundleRefraction();
const tirHtml = inlineTir();
const heatHtml = fs.readFileSync(path.join(root, 'labs', 'heat-transfer', 'index.html'), 'utf8');

const files = {
  'Open Labs.html': launcher,
  'refraction-lab.html': refractionHtml,
  'total-internal-reflection-lab.html': tirHtml,
  'heat-transfer-lab.html': heatHtml,
};

for (const [name, contents] of Object.entries(files)) {
  fs.writeFileSync(path.join(packDir, name), contents, 'utf8');
}

fs.writeFileSync(path.join(root, 'exports', 'refraction-lab.html'), refractionHtml, 'utf8');
fs.writeFileSync(path.join(root, 'exports', 'total-internal-reflection-lab.html'), tirHtml, 'utf8');

const zipPath = path.join(root, 'exports', 'S3-Phy-Labs.zip');
fs.rmSync(zipPath, { force: true });
execSync(`tar -a -c -f "${zipPath}" "S3-Phy-Labs"`, {
  cwd: path.dirname(packDir),
  stdio: 'inherit',
});

function kb(file) {
  return `${(fs.statSync(file).size / 1024).toFixed(1)} KB`;
}

fs.rmSync(path.dirname(packDir), { recursive: true, force: true });

console.log('Wrote', zipPath, kb(zipPath));
for (const name of Object.keys(files)) {
  console.log(' ', name, `${(Buffer.byteLength(files[name], 'utf8') / 1024).toFixed(1)} KB`);
}
