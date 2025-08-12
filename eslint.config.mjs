import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  // Config de base Next.js + TypeScript
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  {
    ignores: [
      "src/generated/**/*",
      "**/generated/**/*",
      "**/*.generated.*",
      ".next/**/*",
      "node_modules/**/*",
    ],
    rules: {
      /* ===== Variables inutilisées ===== */
      "no-unused-vars": "off", // on désactive la version JS
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "all",
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],

      /* ===== Imports ===== */
      "import/no-unresolved": "error",
      "import/no-duplicates": "error",
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            ["parent", "sibling", "index"],
          ],
          pathGroups: [
            {
              pattern: "@/**",
              group: "internal",
              position: "after",
            },
          ],
          alphabetize: { order: "asc", caseInsensitive: true },
          "newlines-between": "always",
        },
      ],
      "no-restricted-imports": [
        "error",
        {
          patterns: ["../*"],
        },
      ],

      /* ===== Style & propreté ===== */
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-debugger": "error",
      "no-empty-function": "error",
      "no-var": "error",
      "prefer-const": "error",
      "eqeqeq": ["error", "always"],

      /* ===== Accessibilité ===== */
      "jsx-a11y/alt-text": "warn",
      "jsx-a11y/anchor-is-valid": "warn",
      "jsx-a11y/no-autofocus": "warn",

      /* ===== Bonnes pratiques React ===== */
      "react/jsx-no-duplicate-props": "error",
      "react/jsx-no-undef": "error",
      "react/jsx-key": "error",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
  },
];
