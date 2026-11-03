import js from "@eslint/js";
import security from "eslint-plugin-security";
import globals from "globals";

export default [
  js.configs.recommended,
  {
    languageOptions: {
      globals: globals.browser,
    },
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
