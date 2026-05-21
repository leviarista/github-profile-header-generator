import js from "@eslint/js";
import security from "eslint-plugin-security";

export default [
  js.configs.recommended,
  {
    plugins: { security },
    rules: {
      ...security.configs.recommended.rules,
      "no-eval": "error",
      "no-implied-eval": "error",
      "no-new-func": "error",
      "no-script-url": "error",
      "no-unused-vars": "warn",
      "no-console": "off",
    },
    files: ["js/**/*.js"],
    ignores: ["js/data/patterns.js"],
  },
];
