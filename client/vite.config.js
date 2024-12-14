import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // Specifies the output directory
  },
  resolve: {
    alias: {
      '@': '/src', // Alias for cleaner imports
    },
  },
  base: './', // Use relative paths for assets in production
});
