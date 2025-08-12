import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "src/generated/**/*",
      "**/generated/**/*", 
      "**/*.generated.*",
      ".next/**/*",
      "node_modules/**/*"
    ]
  },
  {
    rules: {
      // Désactiver les variables non utilisées
      "@typescript-eslint/no-unused-vars": "off",
      "no-unused-vars": "off",
      
      // Désactiver les interfaces vides
      "@typescript-eslint/no-empty-object-type": "off",
      
      // Désactiver les entités non échappées dans React
      "react/no-unescaped-entities": "off",
      
      // Désactiver l'avertissement sur les balises img de Next.js
      "@next/next/no-img-element": "off",
      
      // Désactiver les dépendances manquantes dans useEffect
      "react-hooks/exhaustive-deps": "off",
      
      // Désactiver l'usage de 'any' en TypeScript
      "@typescript-eslint/no-explicit-any": "off"
    }
  }
];

export default eslintConfig;