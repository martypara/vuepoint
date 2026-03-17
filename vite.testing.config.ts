import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  build: {
    outDir: ".test-dist",
    emptyOutDir: true,
    lib: {
      entry: resolve(__dirname, "src/testing.ts"),
      formats: ["es"],
      fileName: () => "testing.js",
    },
    rollupOptions: {
      external: ["vite", "@vue/compiler-dom", "@vue/compiler-sfc"],
    },
  },
});
