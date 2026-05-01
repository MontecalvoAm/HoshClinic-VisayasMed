import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import reactHooks from 'eslint-plugin-react-hooks'; // Import react hooks plugin

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ['**/*.{js,jsx,ts,tsx}'], // Apply to JS/TS files
    plugins: {
      'react-hooks': reactHooks, // Register the plugin
    },
    rules: {
      // General stricter rules
      'no-unused-vars': ['warn', { args: 'none', ignoreRestSiblings: true }], // Warn on unused variables, ignore rest siblings
      'no-console': ['warn', { allow: ['warn', 'error'] }], // Warn on console.log, allow console.warn/error
      'eqeqeq': ['error', 'always', { null: 'ignore' }], // Require ===, allow null == undefined
      
      // React Hooks rules
      'react-hooks/rules-of-hooks': 'error', // Checks rules of Hooks
      'react-hooks/exhaustive-deps': 'warn', // Checks effect dependencies
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
