import { readFileSync } from "node:fs";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// single source of truth for the version shown in the app
const { version } = JSON.parse(readFileSync("./package.json", "utf-8"));

// @ts-expect-error process is a nodejs global
const host = process.env.TAURI_DEV_HOST;

// https://vite.dev/config/
export default defineConfig(async () => ({
  plugins: [react()],

  define: {
    __APP_VERSION__: JSON.stringify(version),
  },

  build: {
    // React in a chunk of its own, which every window loads and which stays byte-identical between releases; and the
    // animation library in another, loaded only by the windows that animate with it (see main.tsx).
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (/node_modules[\\/](\.pnpm[\\/])?(react|react-dom|scheduler)[@\\/]/.test(id)) return "react";
          if (/node_modules[\\/](\.pnpm[\\/])?(motion|framer-motion|motion-dom|motion-utils)[@\\/]/.test(id)) return "motion";
        },
      },
    },
  },

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent Vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
          protocol: "ws",
          host,
          port: 1421,
        }
      : undefined,
    watch: {
      // 3. tell Vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"],
    },
  },
}));
