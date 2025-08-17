import path from "path";

import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true, // Listen on all addresses
    port: 5173,
    watch: {
      usePolling: true, // Use polling for file changes in Docker
    },
    proxy: {
      "/api": {
        target: process.env.BACKEND_URL || "http://backend:8000",
        changeOrigin: true,
      },
    },
  },
});
