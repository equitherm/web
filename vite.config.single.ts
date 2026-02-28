import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// Single-file build config - bundles everything into one HTML file
export default defineConfig({
  plugins: [
    react(),
    viteSingleFile()
  ],
  build: {
    outDir: 'dist/single-file',
    emptyOutDir: true,
    target: 'esnext',
    assetsInlineLimit: 100000000, // Inline all assets
    chunkSizeWarningLimit: 100000000,
    rollupOptions: {
      output: {
        inlineDynamicImports: true
      }
    }
  }
})
