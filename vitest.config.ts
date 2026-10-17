import { defineConfig } from 'vitest/config';

// Browser acceptance runs separately against the built application, never inside Vitest.
export default defineConfig({
  test: {
    include: ['tests/unit/**/*.test.ts', 'tests/integration/**/*.test.ts'],
    environment: 'node',
    fileParallelism: false,
    testTimeout: 30_000,
    coverage: {
      provider: 'v8',
      include: ['src/lib/**/*.ts', 'src/scripts/**/*.ts', 'scripts/**/*.mjs'],
      exclude: ['scripts/install-hooks.mjs'],
      reporter: ['text', 'html', 'json-summary'],
    },
  },
});
