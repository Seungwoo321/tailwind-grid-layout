import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  root: 'docs',
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "tailwind-grid-layout": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
  },
  build: {
    outDir: '../docs-dist',
    emptyOutDir: true,
  },
})