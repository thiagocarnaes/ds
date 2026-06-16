import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'node:path'

export default defineConfig({
  root: 'playground',
  base: process.env.PAGES_BASE ?? '/',
  server: {
    open: true,
  },
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@design-system/components': resolve(__dirname, 'src/index.ts'),
    },
  },
})
