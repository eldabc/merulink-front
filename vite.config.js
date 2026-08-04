import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    // Necesario en Docker (Windows/WSL2) los eventos de cambio de archivo
    // no siempre llegan por bind mount. Polling garantiza hot reload.
    watch: {
      usePolling: true,
      interval: 500,
    },
    proxy: {
      '/api': {
        target: 'http://backend:80',
        changeOrigin: true,
      },
      '/sanctum': {
        target: 'http://backend:80',
        changeOrigin: true,
      },
    },
  },
  define: {
    'process.env': {}
  }
})
