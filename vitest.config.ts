import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      include: ['src/model/**/*.ts', 'src/library/**/*.ts'],
      reporter: ['text', 'json-summary'],
    },
    environment: 'node',
  },
});
