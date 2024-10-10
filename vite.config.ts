import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react";
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import path from "path"
import react from "@vitejs/plugin-react"

export default defineConfig({

  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
    css: {
      postcss: {
        plugins: [tailwindcss(), autoprefixer()],
      },
    },
    server: {
        port: 3000,
    },
});




