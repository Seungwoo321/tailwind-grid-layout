import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    exclude: ['src/**/*.browser.test.{ts,tsx}', 'e2e/**', 'node_modules/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      include: ['src/**'],
      exclude: [
        'node_modules/**',
        'src/test/**',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData.ts',
        'src/index.ts',
        '.storybook/**',
        'docs/**',
        'examples/**',
        'stories/**',
        'src/components/ui/**',
        'src/lib/**',
        'src/types/index.ts',
        '**/*.stories.tsx',
        'src/components/TouchTestGrid.tsx',
        'src/utils/touch-debug.ts',
        'src/utils/touch-enhanced.ts',
        'dist/**',
        'playwright/**',
        'scripts/**',
        'e2e/**',
        '**/*.browser.test.*'
      ],
      thresholds: {
        lines: 98,
        branches: 98,
        functions: 85,
        statements: 98
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})