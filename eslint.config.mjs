import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';
import globals from 'globals';
import prettier from 'eslint-config-prettier';

// Vendor scaffolding and generated artifacts have separate ownership; do not rewrite them.
export default [
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      '.astro/**',
      'coverage/**',
      'playwright-report/**',
      'test-results/**',
      '.specify/**',
      '.agents/**',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
  { files: ['**/*.{js,mjs,ts}'], languageOptions: { globals: globals.node } },
  {
    files: ['tests/e2e/**/*.ts', 'src/scripts/**/*.ts'],
    languageOptions: { globals: globals.browser },
  },
  {
    files: ['**/*.astro'],
    languageOptions: { parserOptions: { parser: tseslint.parser } },
  },
  prettier,
];
