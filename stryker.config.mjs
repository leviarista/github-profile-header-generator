/** @type {import('@stryker-mutator/api/core').PartialStrykerOptions} */
export default {
  packageManager: "npm",
  reporters: ["html", "clear-text", "progress"],
  testRunner: "vitest",
  vitest: {
    configFile: "vitest.config.js",
  },
  mutate: ["js/presets.js", "js/helpers/helpers.js", "!js/**/*.test.js"],
  coverageAnalysis: "perTest",
  htmlReporter: {
    fileName: "stryker-report/index.html",
  },
  timeoutMS: 15000,
  concurrency: 2,
  thresholds: {
    high: 70,
    low: 50,
    break: 30,
  },
};
