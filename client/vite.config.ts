import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return {
    plugins: [react()],
    build: {
      outDir: path.resolve(__dirname, "../build/client"),
      emptyOutDir: true,
    },
  };
});
