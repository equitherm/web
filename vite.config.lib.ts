import { defineConfig } from 'vite'

// Library build config - exports core calculation functions
export default defineConfig({
  build: {
    lib: {
      entry: 'src/core/index.ts',
      name: 'EquithermCore',
      fileName: 'equitherm-core',
      formats: ['es']
    },
    outDir: 'dist/core',
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      // No external dependencies - core is pure JS
    }
  }
})
