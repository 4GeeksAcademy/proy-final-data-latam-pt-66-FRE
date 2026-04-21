import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    allowedHosts: true,
    proxy: {
      '/api': {
        target: 'https://solid-broccoli-97rj4r4r5p543rgg-3001.app.github.dev',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    outDir: 'dist'
  }
})