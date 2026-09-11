import { defineConfig } from 'vite';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.dirname(fileURLToPath(import.meta.url));

function rewriteToPublicIndex(req) {
  if (!req.url || (req.method !== 'GET' && req.method !== 'HEAD')) return;
  const qIndex = req.url.indexOf('?');
  const rawPath = qIndex === -1 ? req.url : req.url.slice(0, qIndex);
  const suffix = qIndex === -1 ? '' : req.url.slice(qIndex);
  if (path.extname(rawPath)) return;
  const rel = decodeURIComponent(rawPath);
  const indexFile = path.join(rootDir, 'public', rel, 'index.html');
  if (!fs.existsSync(indexFile) || !fs.statSync(indexFile).isFile()) return;
  const dir = rawPath.endsWith('/') ? rawPath : `${rawPath}/`;
  req.url = `${dir}index.html${suffix}`;
}

function publicDirIndex() {
  const apply = (server) => {
    server.middlewares.use((req, _res, next) => {
      rewriteToPublicIndex(req);
      next();
    });
  };
  return {
    name: 'public-dir-index',
    configureServer: apply,
    configurePreviewServer: apply,
  };
}

const stripGhRedirect = {
  name: 'strip-gh-redirect-for-build',
  transformIndexHtml(html) {
    return html.replace(/<!--GH_REDIRECT-->[\s\S]*?<!--\/GH_REDIRECT-->\s*/g, '');
  },
};

export default defineConfig(({ command }) => ({
  base: './',
  plugins: command === 'build' ? [stripGhRedirect] : [publicDirIndex()],
  server: {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
    },
    watch: {
      usePolling: true,
      interval: 100,
    },
  },
}));
