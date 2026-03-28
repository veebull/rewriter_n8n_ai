import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/webhook': {
        target: 'https://n8n.permanare.ru',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/webhook/, '/webhook-test'),
      }
    }
  }
})
