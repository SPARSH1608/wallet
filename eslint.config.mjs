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
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
  {
    rules: {
      // Ignore unused variables
      "@typescript-eslint/no-unused-vars": "off",
      "no-unused-vars": "off",
      
      // Ignore unescaped entities in JSX
      "react/no-unescaped-entities": "off",
      
      // Allow any type (useful for API responses)
      "@typescript-eslint/no-explicit-any": "off",
      
      // Allow require imports
      "@typescript-eslint/no-require-imports": "off",
      
      // Make exhaustive deps a warning instead of error
      "react-hooks/exhaustive-deps": "warn",

      // Optional: Keep unused variables that start with underscore
      // "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
      // "no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    },
  },
];

export default eslintConfig;
