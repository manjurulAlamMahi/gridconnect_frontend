import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss(),],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      '/broadcasting': {
        target: 'https://admin.gridconnect.app',
        changeOrigin: true,
        secure: false,
      },
      '/api': {
        target: 'https://admin.gridconnect.app',
        changeOrigin: true,
        secure: false,
      }
    }
  }
});
