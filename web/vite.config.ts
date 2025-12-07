import path from "path"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // ❌ No minification / no compression
    minify: false,

    // ❌ Prevent Vite/Rollup from splitting into multiple chunks
    rollupOptions: {
      output: {
        manualChunks: undefined,
        entryFileNames: 'app.js',
        chunkFileNames: 'app.js',
        assetFileNames: 'assets/[name].[ext]'
      }
    },
  }
})
