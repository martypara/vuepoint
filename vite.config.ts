import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";
import { resolve } from "node:path";
import { vuepoint } from "./src/vite";

export default defineConfig({
  plugins: [
    vue(),
    vuepoint(),
    dts({
      include: ["src/**/*.ts", "src/**/*.vue"],
      exclude: ["src/dev/**"],
    }),
  ],
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, "src/index.ts"),
        vite: resolve(__dirname, "src/vite.ts"),
      },
      name: "Vuepoint",
      cssFileName: "style",
      fileName: (format, entryName) => {
        if (entryName === "vite") {
          return format === "es" ? "vite.js" : "vite.cjs";
        }

        return format === "es" ? "vuepoint.js" : "vuepoint.cjs";
      },
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: ["vue", "vite", "@vue/compiler-dom", "@vue/compiler-sfc"],
      output: {
        exports: "named",
        globals: {
          vue: "Vue",
        },
      },
    },
  },
});
