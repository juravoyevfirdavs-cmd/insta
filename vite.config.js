import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

const BACKEND_URL = 'http://localhost:5000'

// https://vite.dev/config/
export default defineConfig({
  // Render (yoki ildiz manzilda joylashgan saytlar) uchun base '/' bo'lishi kerak
  base: '/', 
  
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': BACKEND_URL,
      '/socket.io': { target: BACKEND_URL, ws: true },
    },
  },
  build: {
    target: 'esnext', // для top-level await в main.js
  },
})
