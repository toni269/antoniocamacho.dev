import { defineConfig } from '@playwright/test';

// Every project uses a fresh browser context; preview serves the existing dist artifact.
export default defineConfig({
  testDir: './tests/e2e',
  reporter: [['list'], ['json', { outputFile: 'test-results/results.json' }]],
  fullyParallel: false,
  use: {
    baseURL: 'http://127.0.0.1:4321',
    trace: 'retain-on-failure',
    colorScheme: 'dark',
  },
  projects: [
    {
      name: 'mobile',
      use: { browserName: 'chromium', viewport: { width: 360, height: 800 } },
    },
    {
      name: 'landscape',
      use: { browserName: 'chromium', viewport: { width: 800, height: 360 } },
    },
    {
      name: 'desktop',
      use: { browserName: 'chromium', viewport: { width: 1440, height: 900 } },
    },
  ],
  webServer: {
    command: 'npm run preview',
    url: 'http://127.0.0.1:4321',
    reuseExistingServer: false,
    timeout: 30_000,
  },
});
