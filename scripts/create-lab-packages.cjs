const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const base = path.join(__dirname, '..');

function gitShow(relPath) {
  return execSync(`git show HEAD:${relPath.replace(/\\/g, '/')}`, { cwd: base, encoding: 'utf8' });
}

function extractLocaleKeys(file, prefixes) {
  const src = fs.readFileSync(path.join(base, file), 'utf8');
  const out = {};
  for (const line of src.split(/\r?\n/)) {
    const m = line.match(/^\s*'(tools\.(?:rotatingMirror|rgbMixer|thermometerLab|faultyCalibration|floatingControls)[^']+)':\s*(.+),?\s*$/);
    if (!m) continue;
    const key = m[1];
    if (!prefixes.some((p) => key.startsWith(p))) continue;
    let val = m[2].trim().replace(/,\s*$/, '');
    if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
    out[key] = val
      .replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16)))
      .replace(/\\n/g, '\n');
  }
  return out;
}

function makeI18nJs(enKeys, zhKeys) {
  const fmt = (obj) => Object.entries(obj).map(([k, v]) => `  '${k}': ${JSON.stringify(v)}`).join(',\n');
  return `/** Standalone i18n — flat locale keys for t(key). */
export let currentLang = 'zh';

export function hubLangToLocal(hubLang) {
  if (hubLang === 'zh-Hant' || hubLang === 'zh') return 'zh';
  return 'en';
}

export function initLangFromUrl() {
  const lang = new URLSearchParams(location.search).get('lang');
  if (lang) currentLang = hubLangToLocal(lang);
}

export function setLang(lang) {
  currentLang = lang === 'en' ? 'en' : 'zh';
  document.documentElement.lang = currentLang === 'zh' ? 'zh-HK' : 'en';
  return currentLang;
}

export function getLang() {
  return currentLang;
}

const STRINGS = {
  en: {
${fmt(enKeys)}
  },
  zh: {
${fmt(zhKeys)}
  },
};

export function createT(lang = currentLang) {
  const map = STRINGS[lang === 'en' ? 'en' : 'zh'] || STRINGS.zh;
  return (key) => map[key] ?? key;
}
`;
}

function extractRmlCss(src) {
  const m = src.match(/const RML_CSS = `([\s\S]*?)`;/);
  return m ? m[1] : '';
}

function extractThermCss(src) {
  const m = src.match(/const CSS = `([\s\S]*?)`;/);
  return m ? m[1] : '';
}

function extractRgbCss() {
  const src = fs.readFileSync(path.join(base, 'src/style.css'), 'utf8');
  const start = src.indexOf('.rgb-mixer-lead {');
  const end = src.indexOf('/* Responsive — width, height, aspect-ratio');
  return src.slice(start, end).trimEnd();
}

function makeRmlAppJs(src) {
  let out = src.replace(/\r\n/g, '\n');
  out = out.replace(/const RML_STYLE_ID[\s\S]*?function ensureRmlStyles\(\) \{[\s\S]*?\}\n\n/, '');
  out = out.replace('export function createRotatingMirrorLab(t)', 'export function initRotatingMirror(root, t)');
  out = out.replace('return wrap;\n}', '  root.appendChild(wrap);\n  return wrap;\n}');
  return out.replace(/^\/\*\*[\s\S]*?\*\/\n\n/, '/** Standalone lab app module. */\n\n');
}

function makeRgbAppJs(src) {
  let out = src.replace(/\r\n/g, '\n');
  out = out.replace('export function createRgbColorMixerLab(t)', 'export function initRgbColorMixer(root, t)');
  out = out.replace('return wrap;\n}', '  root.appendChild(wrap);\n  return wrap;\n}');
  return '/** Standalone lab app module. */\n\n' + out.replace(/^\/\*\*[\s\S]*?\*\/\n\n?/, '');
}

function patchThermLabJs(src) {
  let out = src.replace(/\r\n/g, '\n');
  out = out.replace(
    /const STYLE_ID = 's3phy-thermometer-lab-css';\nconst THERM_FLOAT_BREAKPOINT = 1024;\n\nconst CSS = `[\s\S]*?`;\n\nfunction ensureStyles\(\) \{[\s\S]*?\}\n\n/,
    'const THERM_FLOAT_BREAKPOINT = 1024;\n\n'
  );
  out = out.replace(/\s*ensureStyles\(\);\n/g, '\n');
  return out;
}

const rmlSrc = gitShow('src/tools/rotatingMirrorLab.js');
const rgbSrc = gitShow('src/tools/rgbColorMixerLab.js');
const thermSrcRaw = fs.readFileSync(path.join(base, 'labs/thermometer/js/lab.js'), 'utf8');

const rmlPrefixes = ['tools.rotatingMirror.'];
const rgbPrefixes = ['tools.rgbMixer.'];
const thermPrefixes = ['tools.thermometerLab.', 'tools.faultyCalibration.', 'tools.floatingControls.'];

const files = {};
files['rotating-mirror/styles.css'] = [
  'html, body { margin: 0; padding: 0; background: #0d0d10; }',
  '#app { padding: 8px; }',
  'html.s3phy-embed, html.s3phy-embed body { min-height: 100%; background: #0d0d10; }',
  'html.s3phy-embed #app { padding: 4px; min-height: 100%; }',
  extractRmlCss(rmlSrc),
].join('\n');

files['rgb-color-mixer/styles.css'] = [
  ':root { --surface: #ffffff; --surface2: #f1f3f5; --border: #e8eaed; --mono: ui-monospace, "Cascadia Code", monospace; }',
  'html, body { margin: 0; padding: 0; font-family: system-ui, -apple-system, "Segoe UI", sans-serif; background: #f8f9fa; color: #1a1c2c; }',
  '#app { padding: 12px; max-width: 1200px; margin: 0 auto; }',
  'html.s3phy-embed, html.s3phy-embed body { min-height: 100%; background: #f8f9fa; }',
  'html.s3phy-embed #app { max-width: none; padding: 8px; min-height: 100%; }',
  extractRgbCss(),
].join('\n');

files['thermometer/styles.css'] = [
  'html, body { margin: 0; padding: 0; background: #09090b; }',
  '#app { padding: 8px; }',
  'html.s3phy-embed, html.s3phy-embed body { min-height: 100%; background: #09090b; }',
  'html.s3phy-embed #app { padding: 4px; min-height: 100%; }',
  extractThermCss(thermSrcRaw),
].join('\n');

files['rotating-mirror/js/i18n.js'] = makeI18nJs(
  extractLocaleKeys('src/locales/en.js', rmlPrefixes),
  extractLocaleKeys('src/locales/zhHant.js', rmlPrefixes)
);
files['rgb-color-mixer/js/i18n.js'] = makeI18nJs(
  extractLocaleKeys('src/locales/en.js', rgbPrefixes),
  extractLocaleKeys('src/locales/zhHant.js', rgbPrefixes)
);
files['thermometer/js/i18n.js'] = makeI18nJs(
  extractLocaleKeys('src/locales/en.js', thermPrefixes),
  extractLocaleKeys('src/locales/zhHant.js', thermPrefixes)
);

files['rotating-mirror/js/app.js'] = makeRmlAppJs(rmlSrc);
files['rgb-color-mixer/js/app.js'] = makeRgbAppJs(rgbSrc);
files['thermometer/js/lab.js'] = patchThermLabJs(thermSrcRaw);

files['rotating-mirror/js/boot.js'] = `import { initRotatingMirror } from './app.js';
import { createT, hubLangToLocal, initLangFromUrl, setLang, getLang } from './i18n.js';

const root = document.getElementById('app');

function mount() {
  if (!root) return;
  root.replaceChildren();
  initRotatingMirror(root, createT(getLang()));
}

function applyLang(lang) {
  setLang(lang);
  mount();
}

initLangFromUrl();
applyLang(getLang());

window.addEventListener('message', (ev) => {
  if (ev.data?.type !== 's3phy:lang') return;
  const next = hubLangToLocal(ev.data.lang);
  if (next === getLang()) return;
  applyLang(next);
});
`;

files['rgb-color-mixer/js/boot.js'] = files['rotating-mirror/js/boot.js'].replaceAll('initRotatingMirror', 'initRgbColorMixer');

files['thermometer/js/boot.js'] = `import { createThermometerLab, createFaultyScaleCalibrationLab } from './lab.js';
import { createT, hubLangToLocal, initLangFromUrl, setLang, getLang } from './i18n.js';

const root = document.getElementById('app');
const MODES = new Set(['liquid', 'resistance', 'thermistor', 'faulty']);

function modeFromUrl() {
  const mode = new URLSearchParams(location.search).get('mode') || 'liquid';
  return MODES.has(mode) ? mode : 'liquid';
}

function mount() {
  if (!root) return;
  root.replaceChildren();
  const t = createT(getLang());
  const mode = modeFromUrl();
  const lab = mode === 'faulty'
    ? createFaultyScaleCalibrationLab(t)
    : createThermometerLab(t, { type: mode });
  root.appendChild(lab);
}

function applyLang(lang) {
  setLang(lang);
  mount();
}

initLangFromUrl();
applyLang(getLang());

window.addEventListener('message', (ev) => {
  if (ev.data?.type !== 's3phy:lang') return;
  const next = hubLangToLocal(ev.data.lang);
  if (next === getLang()) return;
  applyLang(next);
});
`;

function htmlShell(title) {
  return `<!DOCTYPE html>
<html lang="zh-HK" translate="no">
<head>
  <meta charset="UTF-8">
  <meta name="google" content="notranslate">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <link rel="stylesheet" href="../shared/s3phy-embed.css">
  <script src="../shared/s3phy-embed-init.js"></script>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div id="app"></div>
  <script type="module" src="js/boot.js"></script>
</body>
</html>
`;
}

files['rotating-mirror/index.html'] = htmlShell('Rotating Plane Mirror Lab');
files['rgb-color-mixer/index.html'] = htmlShell('RGB Colour Mixer Lab');
files['thermometer/index.html'] = htmlShell('Thermometer Lab');

files['rotating-mirror/manifest.json'] = JSON.stringify({ slug: 'rotating-mirror', syncAll: true, exclude: ['manifest.json', 'README.md'] }, null, 2);
files['rgb-color-mixer/manifest.json'] = JSON.stringify({ slug: 'rgb-color-mixer', syncAll: true, exclude: ['manifest.json', 'README.md'] }, null, 2);
files['thermometer/manifest.json'] = JSON.stringify({ slug: 'thermometer', syncAll: true, exclude: ['manifest.json', 'README.md'] }, null, 2);

files['rotating-mirror/README.md'] = '# Rotating Plane Mirror Lab\n\nInteractive ray diagram for mirror rotation and 2\u03b8 ray shift. Open `index.html` or embed with `?embed=1&lang=zh|en`.\n';
files['rgb-color-mixer/README.md'] = '# RGB Colour Mixer Lab\n\nAdditive RGB light mixing with sliders and presets. Open `index.html` or embed with `?embed=1&lang=zh|en`.\n';
files['thermometer/README.md'] = '# Thermometer Lab\n\nLiquid-in-glass, platinum resistance, thermistor, and faulty-scale calibration modes. Use `?mode=liquid|resistance|thermistor|faulty` and `?lang=zh|en`.\n';

const outJson = path.join(base, 'scripts', '_lab-gen-output.json');
fs.writeFileSync(outJson, JSON.stringify(files));
console.log('Prepared', Object.keys(files).length, 'files');
console.log('RML css:', extractRmlCss(rmlSrc).length, 'RGB app lines:', files['rgb-color-mixer/js/app.js'].split('\n').length);
console.log('Therm patched CSS removed:', !files['thermometer/js/lab.js'].includes('const CSS ='));