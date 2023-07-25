import { resolve } from 'path'
import { defineConfig } from 'vite'
import glsl from 'vite-plugin-glsl'

export default defineConfig({
  root: 'src',
  publicDir: '../public/',
  base: '/webglschool/',
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
        assgn03: resolve(__dirname, 'src/assgn03/index.html'),
        assgn04: resolve(__dirname, 'src/assgn04/index.html'),
        assgn05: resolve(__dirname, 'src/assgn05/index.html'),
        assgn06: resolve(__dirname, 'src/assgn06/index.html'),
        // assgn07: resolve(__dirname, 'src/assgn07/index.html'),
        // assgn08: resolve(__dirname, 'src/assgn08/index.html'),
      },
    },
  },
  plugins: [glsl()],
  resolve: {
    alias: {
      '/@shaders/': `${process.cwd()}/src/assets/shaders/`,
    },
  },
})
