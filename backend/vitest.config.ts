import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    env: {
      ADMIN_USERNAME: 'admin',
      ADMIN_PASSWORD: 'test-admin-password',
      SESSION_COOKIE_NAME: 'taskflow_session',
    },
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.ts'],
      exclude: ['src/index.ts', 'src/config/**'],
    },
  },
});
