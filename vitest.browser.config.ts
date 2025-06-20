import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    browser: {
      enabled: true,
      provider: 'playwright',
      instances: [
        {
          browser: 'chromium',
          headless: true,
        }
      ],
    },
    globals: true,
    setupFiles: ['./src/test/browser-setup.ts'],
    include: ['src/**/*.browser.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage/browser',
      exclude: [
        'node_modules/',
        'src/test/',
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
        '**/node_modules/**',
        'dist/**'
      ]
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})