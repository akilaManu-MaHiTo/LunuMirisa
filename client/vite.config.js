import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  build: {
    outDir: 'dist', // Specifies the output directory for the build
  },

  resolve: {
    alias: {
      '@': '/src', // Alias for cleaner imports
    },
  },

  base: './', // Ensures correct asset paths for production builds
});
