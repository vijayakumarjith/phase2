import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true
  },
  // Remove the optimizeDeps exclusion that might be causing issues
  build: {
    sourcemap: true,
    outDir: 'dist',
  }
});