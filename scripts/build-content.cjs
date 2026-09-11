const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const repoRoot = path.join(__dirname, '..');
const SOURCE_ROOTS = ['labs', 'quizzes', 'worksheets'];
const SKIP_COMPONENTS = new Set(['shared']);
const DEFAULT_EXCLUDE = new Set(['manifest.json', 'README.md', 'node_modules', '.git', '__pycache__']);
const DEFAULT_EXCLUDE_DIRS = new Set(['scripts', 'draft', 'sources', 'extracted', 'node_modules', '__pycache__']);
function readManifest(componentDir) {
  const p = path.join(componentDir, 'manifest.json');
  if (!fs.existsSync(p)) return {};
  return JSON.parse(fs.readFileSync(p, 'utf8').replace(/^\uFEFF/, ''));
}
function shouldExclude(name, excludeSet, excludeDirs) { return excludeSet.has(name) || excludeDirs.has(name); }
function copyEntry(src, dest, excludeSet, excludeDirs) {
  const stat = fs.statSync(src); const base = path.basename(src);
  if (shouldExclude(base, excludeSet, excludeDirs)) return;
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src)) copyEntry(path.join(src, entry), path.join(dest, entry), excludeSet, excludeDirs);
    return;
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true }); fs.copyFileSync(src, dest);
}
function runBuild(componentDir, manifest) {
  if (!manifest.build) return;
  const script = path.join(componentDir, manifest.build);
  if (!fs.existsSync(script)) { console.warn('  build script missing: ' + manifest.build); return; }
  if (path.extname(manifest.build) === '.py') execSync('python "' + script + '"', { cwd: componentDir, stdio: 'inherit' });
  else execSync('node "' + path.basename(script) + '"', { cwd: componentDir, stdio: 'inherit' });
}
function syncComponent(componentDir, category) {
  const name = path.basename(componentDir);
  const manifest = readManifest(componentDir);
  if (manifest.skip || SKIP_COMPONENTS.has(name)) { console.log('[' + category + '] skip ' + name); return; }
  const slug = manifest.slug || name;
  const publicDir = path.join(repoRoot, 'public', slug);
  console.log('[' + category + '] ' + name + ' -> public/' + slug + '/');
  runBuild(componentDir, manifest);
  if (Array.isArray(manifest.sync) && manifest.sync.length > 0) {
    for (const rel of manifest.sync) {
      const src = path.join(componentDir, rel); const dest = path.join(publicDir, rel);
      if (!fs.existsSync(src)) { console.warn('  missing sync file: ' + rel); continue; }
      if (fs.statSync(src).isDirectory()) copyEntry(src, dest, DEFAULT_EXCLUDE, DEFAULT_EXCLUDE_DIRS);
      else { fs.mkdirSync(path.dirname(dest), { recursive: true }); fs.copyFileSync(src, dest); }
    }
    return;
  }
  const exclude = new Set([...DEFAULT_EXCLUDE, ...(manifest.exclude || [])]);
  const excludeDirs = new Set([...DEFAULT_EXCLUDE_DIRS, ...(manifest.excludeDirs || [])]);
  if (manifest.syncAll !== false) {
    fs.mkdirSync(publicDir, { recursive: true });
    for (const entry of fs.readdirSync(componentDir)) copyEntry(path.join(componentDir, entry), path.join(publicDir, entry), exclude, excludeDirs);
  }
}
function syncShared() {
  const src = path.join(repoRoot, 'labs', 'shared');
  const dest = path.join(repoRoot, 'public', 'shared');
  if (!fs.existsSync(src)) return;
  console.log('[labs] shared -> public/shared/');
  copyEntry(src, dest, DEFAULT_EXCLUDE, DEFAULT_EXCLUDE_DIRS);
}

function main() {
  syncShared();
  let count = 0;
  for (const rootName of SOURCE_ROOTS) {
    const sourceRoot = path.join(repoRoot, rootName);
    if (!fs.existsSync(sourceRoot)) { console.log('Skip missing ' + rootName + '/'); continue; }
    for (const entry of fs.readdirSync(sourceRoot)) {
      const componentDir = path.join(sourceRoot, entry);
      if (!fs.statSync(componentDir).isDirectory()) continue;
      syncComponent(componentDir, rootName); count += 1;
    }
  }
  console.log('Synced ' + count + ' component(s) to public/.');
}
main();