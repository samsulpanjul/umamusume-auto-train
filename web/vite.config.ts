import path from "path"
import fs from "fs"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

function readPythonVersion(): string {
  const filePath = path.resolve(__dirname, "../utils/log.py")
  const content = fs.readFileSync(filePath, "utf8")

  const match = content.match(/^VERSION\s*=\s*["'](.+)["']/m)
  return match ? match[1] : "unknown"
}

const APP_VERSION = readPythonVersion()

export default defineConfig({
  plugins: [react(), tailwindcss()],

  define: {
    __APP_VERSION__: JSON.stringify(APP_VERSION),
  },

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
})
