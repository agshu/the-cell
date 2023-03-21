import { defineConfig } from "vite";

export default defineConfig({
  base: "/the-cell/",
  build: {
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
  assetsInclude: "/assets/stemcell.gltf",
});
