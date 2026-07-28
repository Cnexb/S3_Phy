import { defineConfig } from 'vite';

const stripGhRedirect = {
  name: 'strip-gh-redirect-for-build',
  transformIndexHtml(html) {
    return html.replace(/<!--GH_REDIRECT-->[\s\S]*?<!--\/GH_REDIRECT-->\s*/g, '');
  },
};

export default defineConfig(({ command }) => ({
  base: './',
  plugins: command === 'build' ? [stripGhRedirect] : [],
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