import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    host: true,
    port: 5173,
    watch: {
      usePolling: true,
      interval: 100,
    },
    proxy: {
      '/transacciones': {
        target: 'http://backend:8000',
        changeOrigin: true
      }
    }
  }
})