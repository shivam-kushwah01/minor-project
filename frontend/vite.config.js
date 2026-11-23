import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// In development, /api and /uploads are proxied to the local backend,
// so the browser sees a single origin and session cookies just work.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:8080",
      "/uploads": "http://localhost:8080",
    },
  },
});
