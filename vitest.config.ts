import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    name: "nodeTest",
    coverage: {
      reporter: ["text", "lcov"],
      include: ["src/**/*.js"],
      exclude: ["src/js/main.js"],
    },
  },
});
