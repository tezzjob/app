import path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return {
    plugins: [react()],
    base: "/",
    build: {
      outDir: path.resolve(__dirname, "../build/client"),
      emptyOutDir: true,
    },
    server: {
      middlewareMode: false, // Ensures Vite handles static serving
      hmr: true, // Enables Hot Module Replacement
      watch: {
        usePolling: true, // Fixes issues in some environments
      },
    },
  };
});
