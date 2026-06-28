import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    fs: {
      // Allow reading files from the monorepo root (needed for CHANGELOG.md?raw)
      allow: [resolve(__dirname, '../..')],
    },
  },
  test: {
    environment: 'happy-dom',
    globals: true,
    include: ['tests/**/*.spec.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        'tests/',
        '**/*.spec.ts',
        '**/*.config.*',
        '**/types.ts',
      ],
      lines: true,
      statements: true,
      functions: false,
      branches: false,
    },
  },
})
