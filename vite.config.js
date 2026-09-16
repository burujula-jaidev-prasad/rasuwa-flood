import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        delhi: resolve(import.meta.dirname, 'delhi.html'),
        newyork: resolve(import.meta.dirname, 'newyork.html'),
        nepal: resolve(import.meta.dirname, 'nepal.html')
      }
    }
  }
});
