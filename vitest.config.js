import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.js"],
    include: ["tests/unit/**/*.test.js", "tests/integration/**/*.test.js"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      reportsDirectory: "./coverage",
      include: ["js/**/*.js"],
      exclude: [
        // Módulos de UI pura: solo testables vía E2E (navegador real)
        "js/main.js",
        "js/toolbox-main.js",
        "js/toolbox-background.js",
        "js/toolbox-decorations.js",
        "js/toolbox-presets.js",
        // Datos estáticos sin lógica ejecutable
        "js/data/patterns.js",
      ],
      thresholds: {
        lines: 70,
        functions: 80,
        branches: 60,
      },
    },
  },
});
