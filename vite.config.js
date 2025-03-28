import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  server: {
    historyApiFallback: true, // 👈 추가
  },
  plugins: [react()],
});
