import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
// Remove Replit-specific overlay in production builds
let runtimeErrorOverlay: any = undefined;
try {
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    runtimeErrorOverlay = require("@replit/vite-plugin-runtime-error-modal").default;
  }
} catch {}

export default defineConfig({
  plugins: [
    react(),
    ...(runtimeErrorOverlay ? [runtimeErrorOverlay()] : []),
    ...(process.env.NODE_ENV !== "production" && process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) => m.cartographer()),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    rollupOptions: {
      // When SSG mode is enabled, use ssg.html as entry so vite-ssg runs
      input: process.env.VITE_SSG ? path.resolve(import.meta.dirname, "client/ssg.html") : undefined,
    },
  },
  server: {
    port: 5000,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      Pragma: 'no-cache',
      Expires: '0',
      'Surrogate-Control': 'no-store',
    },
    proxy: {
      // Proxy API calls to Vercel Dev (or any API server) to keep a single origin in dev
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        // do not rewrite, we want /api/* to pass through as-is
      },
    },
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
