import { defineConfig } from "vite";
import alias from "@rollup/plugin-alias";

export default defineConfig({
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
      // Add the alias plugin to the rollup plugins list
      plugins: [
        alias({
          entries: [
            // Add an alias for the three package
            { find: "three", replacement: "three/build/three.module.js" },
            // Add an alias for the GLTFLoader module
            {
              find: "GLTFLoader",
              replacement: "three/addons/loaders/GLTFLoader.js",
            },
          ],
        }),
      ],
    },
    assetsDir: "assets",
    assetsInlineLimit: 1024 * 1024,
    // Copy these files to the "dist" folder during build
    assetsInclude: ["./stemcell.glb"],
  },
});
