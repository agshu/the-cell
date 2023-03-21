export default {
  base: "/the-cell/",
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
      },
      output: {
        dir: "dist",
        assetFileNames: "assets/[name][extname]",
      },
    },
    assetsDir: "assets",
    assetsInlineLimit: 1024 * 1024,
    // Copy these files to the "dist" folder during build
    assetsInclude: ["./stemcell.glb"],
  },
};
