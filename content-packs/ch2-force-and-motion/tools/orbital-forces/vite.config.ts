import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Relative base so the lab works under hub iframe paths (e.g. ./orbital-forces/).
export default defineConfig({
  base: './',
  plugins: [react()],
})
