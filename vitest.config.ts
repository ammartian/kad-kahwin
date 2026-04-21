import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    include: [
      "convex/functions/__tests__/**/*.test.ts",
      "lib/utils/__tests__/**/*.test.ts",
      "lib/validators/__tests__/**/*.test.ts",
      "stores/__tests__/**/*.test.ts",
    ],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
