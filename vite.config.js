import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': { target: 'https://mg.isah.se', changeOrigin: true },
      '/uploads': { target: 'https://mg.isah.se', changeOrigin: true }
    }
  },
  build: { outDir: 'dist' }
});
