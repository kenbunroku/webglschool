import { defineConfig } from 'vite'

export default defineConfig({
  resolve: {
    alias: {
      three: 'three/build/three.module.js',
    },
  },
})
