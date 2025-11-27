import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// https://vite.dev/config/
export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: true
  },
  // Dev server proxy: forward `/api` to backend running on localhost:4000
  server: {
    proxy: {
      '/api': 'http://localhost:4000'
    }
  },
  plugins: [react()],
})
