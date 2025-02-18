import next from "@next/eslint-plugin-next";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import prettier from "eslint-plugin-prettier";
import globals from "globals";

export default [
  {
    files: ["**/*.{js,ts,jsx,tsx}"],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        sourceType: "module",
      },
      globals: globals.browser,
    },
  },
  {
    plugins: {
      "@next/next": next,
      "@typescript-eslint": tseslint,
      prettier: prettier,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      ...next.configs["core-web-vitals"].rules,
      "prettier/prettier": "error",
      "react/react-in-jsx-scope": "off", // Not needed in Next.js
      "@next/next/no-html-link-for-pages": "off", // Only enable if using file-based routing
    },
  },
];
