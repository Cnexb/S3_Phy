const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const root = __dirname;
const dist = path.join(root, 'dist');
const publicDir = path.join(root, '..', '..', 'public', 'orbital-forces');

if (!fs.existsSync(path.join(root, 'node_modules'))) {
  console.log('[orbital-forces] npm ci…');
  execSync('npm ci', { cwd: root, stdio: 'inherit' });
}

console.log('[orbital-forces] vite build…');
execSync('npm run build', { cwd: root, stdio: 'inherit' });

fs.rmSync(publicDir, { recursive: true, force: true });
fs.cpSync(dist, publicDir, { recursive: true });
console.log('[orbital-forces] published → public/orbital-forces/');
