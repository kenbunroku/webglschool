export default {
  optimizeDeps: {
    include: ['lil-gui'],
  },
  build: {
    commonjsOptions: {
      include: [/lil-gui/, /node_modules/],
    },
  },
}
