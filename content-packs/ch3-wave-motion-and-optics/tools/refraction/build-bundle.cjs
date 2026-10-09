const fs = require('fs');
const path = require('path');

const jsDir = path.join(__dirname, 'js');
const files = ['i18n.js', 'app.js', 'boot.js'];

let bundle = "/* Refraction Lab bundle — classic script for All-In-One (no ES modules) */\n'use strict';\n";
for (const name of files) {
  let code = fs.readFileSync(path.join(jsDir, name), 'utf8');
  code = code.replace(/^import\s+[\s\S]*?from\s+['"][^'"]+['"];?\s*$/gm, '');
  code = code.replace(/^export\s+/gm, '');
  bundle += '\n/* --- ' + name + ' --- */\n' + code + '\n';
}

const out = path.join(jsDir, 'bundle.js');
fs.writeFileSync(out, bundle, 'utf8');
console.log('Wrote bundle.js (' + Math.round(bundle.length / 1024) + ' KB)');
