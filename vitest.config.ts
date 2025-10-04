import { defineConfig } from 'vitest/config'
import path from 'path'
import { config } from 'dotenv'

// Load .env file for tests
config()

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/unit/**/*.test.ts', 'apps/**/__tests__/**/*.test.ts'],
    exclude: ['tests/e2e/**', 'node_modules/**', 'tests/unit/email.service.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        '.next/',
        '**/*.spec.ts',
        '**/*.test.ts',
        '**/types/**',
        '**/*.d.ts',
        'tests/e2e/**',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './apps/api/src'),
    },
  },
})
