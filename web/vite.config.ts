// vite.config.ts
import path from "node:path";
import { defineConfig, mergeConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig(({ mode }) => {
  // ---------- shared base configuration ----------
  const base = {
    plugins: [
      react(),
      tailwindcss(),
      viteStaticCopy({
        targets: [{ src: "src/assets/icons", dest: "assets" }],
      }),
    ],

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },

    build: {
      minify: false,
      rollupOptions: {
        output: {
          manualChunks: undefined,
          entryFileNames: "app.js",
          chunkFileNames: "app.js",
          assetFileNames: "assets/[name].[ext]",
        },
      },
    },
  };

  // ---------- dev‑only additions ----------
  if (mode === "development") {
    const devOnly = {
      server: {
        proxy: {
          "/config": "http://localhost:8000",
          "/themes": "http://localhost:8000",
          "/version.txt": "http://localhost:8000",
        },
      },
    };

    // `mergeConfig` deep‑merges the objects so the dev part
    // is added without overwriting the shared settings.
    return mergeConfig(base, devOnly);
  }

  // production (or any other mode) just uses the base config
  return base;
});
