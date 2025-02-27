import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  root: path.resolve(__dirname, 'client'), // Set the root to the client folder
  build: {
    outDir: path.resolve(__dirname, 'dist/client'),
  },
  server: {
    port: 3000, // Front-end development server port
  },
});
