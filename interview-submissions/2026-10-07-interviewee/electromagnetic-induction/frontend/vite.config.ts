import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'

const workspace = fileURLToPath(new URL('..', import.meta.url))

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    fs: { allow: [workspace, fileURLToPath(new URL('.', import.meta.url))] },
    proxy: {
      '/api': 'http://127.0.0.1:8000',
    },
  },
})
