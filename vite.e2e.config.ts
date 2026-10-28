import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
export default defineConfig({
  root: path.resolve("e2e/fixture"),
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: "convex/react",
        replacement: path.resolve("e2e/fixture/backend.tsx"),
      },
      {
        find: "@convex-dev/auth/react",
        replacement: path.resolve("e2e/fixture/backend.tsx"),
      },
      { find: "@", replacement: path.resolve("src") },
      { find: "@shared", replacement: path.resolve("shared") },
    ],
  },
  server: {
    host: "127.0.0.1",
    port: 3001,
    strictPort: true,
    fs: { allow: [path.resolve(".")] },
  },
});
