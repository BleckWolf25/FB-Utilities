// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@components': path.resolve(__dirname, 'src/components'),
        '@pages': path.resolve(__dirname, 'src/pages'),
        '@assets': path.resolve(__dirname, 'src/assets'),
        '@hooks': path.resolve(__dirname, 'src/hooks'),
        '@context': path.resolve(__dirname, 'src/context'),
      },
    },
    build: {
    target: 'esnext',
    outDir: 'dist',
    minify: 'esbuild',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
    },
    server: {
      port: 3000,
      open: true,
    },
    preview: {
      port: 5000,
      open: true,
    },
    base: mode === 'github-pages' ? '/FB-Utilities/' : '/',
  };
});
