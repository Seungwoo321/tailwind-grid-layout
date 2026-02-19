import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: process.env.BASE_URL || '/',
  server: {
    port: 3603
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
})
