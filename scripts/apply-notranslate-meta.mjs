/**
 * Add Chrome/Google Translate opt-out markers to every shipped HTML entry.
 * Safe to run repeatedly.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ignoredDirectories = new Set(['.git', 'node_modules', '.vite']);
const targets = [
  path.join(root, 'index.html'),
  path.join(root, 'labs'),
  path.join(root, 'quizzes'),
  path.join(root, 'worksheets'),
  path.join(root, 'public'),
  path.join(root, 'dist'),
  path.join(root, 'exports'),
  path.join(root, 'scripts', 'github-pages-repo-root-redirect.html'),
];

function htmlFiles(target, files = []) {
  if (!fs.existsSync(target)) return files;
  const stat = fs.statSync(target);
  if (stat.isFile()) {
    if (path.extname(target).toLowerCase() === '.html') files.push(target);
    return files;
  }
  for (const entry of fs.readdirSync(target, { withFileTypes: true })) {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) continue;
    htmlFiles(path.join(target, entry.name), files);
  }
  return files;
}

function addNoTranslate(html) {
  if (!/<html\b/i.test(html) || !/<head\b/i.test(html)) return html;

  let next = html.replace(/<html\b([^>]*)>/i, (tag, attributes) => {
    if (/\btranslate\s*=/i.test(attributes)) {
      return tag.replace(/\btranslate\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/i, 'translate="no"');
    }
    return `<html${attributes} translate="no">`;
  });

  if (!/<meta\b[^>]*\bname\s*=\s*["']google["'][^>]*\bcontent\s*=\s*["']notranslate["'][^>]*>/i.test(next)
    && !/<meta\b[^>]*\bcontent\s*=\s*["']notranslate["'][^>]*\bname\s*=\s*["']google["'][^>]*>/i.test(next)) {
    next = next.replace(/<head\b([^>]*)>/i, '<head$1>\n  <meta name="google" content="notranslate">');
  }
  return next;
}

const files = [...new Set(targets.flatMap((target) => htmlFiles(target)))];
let updated = 0;

for (const file of files) {
  const before = fs.readFileSync(file, 'utf8');
  const after = addNoTranslate(before);
  if (after === before) continue;
  fs.writeFileSync(file, after, 'utf8');
  updated += 1;
}

console.log(`Applied notranslate markers to ${updated} of ${files.length} HTML files.`);
