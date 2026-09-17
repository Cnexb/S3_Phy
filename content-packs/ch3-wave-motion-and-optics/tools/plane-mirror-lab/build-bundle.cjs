const fs = require('fs');
const path = require('path');

function readUtf8(fp) {
  const buf = fs.readFileSync(fp);
  if (buf.length > 3 && buf[1] === 0) {
    return buf.toString('utf16le');
  }
  return buf.toString('utf8');
}

const jsDir = path.join(__dirname, 'js');
const scenarioDir = path.join(jsDir, 'scenarios');
const files = [
  ['geometry.js', jsDir],
  ['rayColors.js', jsDir],
  ['canvasView.js', jsDir],
  ['rayAnimator.js', jsDir],
  ['planeMirrorSight.js', jsDir],
  ['i18n.js', jsDir],
  ['imageFormation.js', scenarioDir],
  ['minMirrorLength.js', scenarioDir],
  ['minMirrorHeight.js', scenarioDir],
  ['seeBackObject.js', scenarioDir],
  ['angledMirrors.js', scenarioDir],
  ['sketchValidation.js', jsDir],
  ['raySketch.js', scenarioDir],
  ['rayColorControls.js', jsDir],
  ['app.js', jsDir],
];

let bundle = "/* Plane Mirror Lab bundle - Chrome file:// compatible */\n'use strict';\n";
for (const [name, dir] of files) {
  const fp = path.join(dir, name);
  let code = readUtf8(fp);
  code = code.replace(/^import\s+[\s\S]*?from\s+['"][^'"]+['"];?\s*$/gm, '');
  code = code.replace(/^export\s+/gm, '');
  bundle += '\n/* --- ' + name + ' --- */\n' + code + '\n';
}
const out = path.join(jsDir, 'bundle.js');
fs.writeFileSync(out, bundle, 'utf8');
console.log('Wrote bundle.js (' + Math.round(bundle.length / 1024) + ' KB)');