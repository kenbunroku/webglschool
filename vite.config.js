import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      external: ['three'],
      output: {
        globals: {
          three: 'THREE',
        },
      },
    },
  },
  resolve: {
    alias: {
      three: '/path/to/three.module.js', // path to your three.module.js
    },
  },
})
