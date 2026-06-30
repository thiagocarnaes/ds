import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import dts from 'vite-plugin-dts'
import { resolve } from 'node:path'

export default defineConfig({
  base: '/ds/',
  plugins: [
    vue(),
    tailwindcss(),
    dts({
      include: ['src'],
      outDir: 'dist',
      insertTypesEntry: true,
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'DesignSystem',
      formats: ['es'],
      fileName: 'design-system',
    },
    rollupOptions: {
      external: ['vue', '@vueuse/core'],
      output: {
        assetFileNames: 'design-system.[ext]',
      },
    },
  },
})
