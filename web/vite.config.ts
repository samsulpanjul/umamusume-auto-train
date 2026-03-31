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
          // core API routes
          "/themes": "http://localhost:8002",
          "/theme": "http://localhost:8002",
          "/calculate": "http://localhost:8002",
          "/set_min_score_state": "http://localhost:8002",
          "/load_action_calc": "http://localhost:8002",
          "/load_min_scores": "http://localhost:8002",
          "/calc_min_score_state": "http://localhost:8002",
          "/config": "http://localhost:8002",
          "/config/setup": "http://localhost:8002",
          "/api/webhook": "http://localhost:8002",
          "/config/applied-preset": "http://localhost:8002",
          "/configs": "http://localhost:8002",
          "/configs/*": "http://localhost:8002",
          "/version.txt": "http://localhost:8002",
          "/notifs": "http://localhost:8002",
          "/event": "http://localhost:8002",
          "/data": "http://localhost:8002",
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
