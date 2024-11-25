import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    port: 5173, // Specifies the port for the dev server
    open: true, // Automatically opens the app in the browser on start
  },

  build: {
    outDir: 'dist', // Specifies the build output directory
  },

  resolve: {
    alias: {
      '@': '/src', // Simplifies import paths by aliasing "src" to "@"
    },
  },

  base: process.env.NODE_ENV === 'production' ? './' : '/', // Ensures correct asset paths
});
