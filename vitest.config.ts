import { defineConfig } from 'vitest/config';

// Playwright owns tests/e2e/**. Vitest must only load unit-test files.
export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts'],
    exclude: ['**/node_modules/**', '**/dist/**'],
  },
});
