import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  root: 'src/',
  base: '/',
  server: {
    port: 3000,
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'src/index.html'),
        assgn01: resolve(__dirname, 'src/assgn01/index.html'),
        assgn02: resolve(__dirname, 'src/assgn02/index.html'),
      },
    },
  },
})
