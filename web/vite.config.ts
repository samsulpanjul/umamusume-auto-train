import path from "path"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    viteStaticCopy({ targets: [{ src: 'src/assets/icons', dest: 'assets' }] })
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
        entryFileNames: 'app.js',
        chunkFileNames: 'app.js',
        assetFileNames: 'assets/[name].[ext]'
      }
    },
  }
})
