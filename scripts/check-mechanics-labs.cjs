const fs = require('fs');
const path = require('path');

for (const f of ['labs/vector-tool/index.html', 'labs/projectile-motion/index.html']) {
  const html = fs.readFileSync(path.join(__dirname, '..', f), 'utf8');
  const scripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)];
  let ok = true;
  for (const m of scripts) {
    const src = m[0].includes('src=');
    if (src) continue;
    try {
      // eslint-disable-next-line no-new-func
      new Function(m[1]);
    } catch (e) {
      console.error(f + ': SCRIPT ERROR', e.message);
      ok = false;
    }
  }
  if (ok) console.log(f + ': script OK (' + scripts.length + ' blocks)');
  const checks = [
    ['s3phy-embed.css', html.includes('s3phy-embed.css')],
    ['lab-section', html.includes('lab-section')],
    ['#f8f9fa', html.includes('#f8f9fa')],
  ];
  for (const [name, pass] of checks) {
    console.log('  ' + name + ': ' + (pass ? 'yes' : 'NO'));
  }
}
