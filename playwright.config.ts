import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests/e2e',
  // CI reruns a failing browser case once to distinguish intermittent timing issues
  // from reproducible failures. Both attempts remain visible in GitHub Actions.
  retries: process.env.CI ? 1 : 0,
  use: { baseURL: 'http://127.0.0.1:4321' },
  webServer: { command: 'npm run dev -- --port 4321', url: 'http://127.0.0.1:4321', reuseExistingServer: !process.env.CI, timeout: 120000 },
});
