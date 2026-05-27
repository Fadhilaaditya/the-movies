import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'svgr',
      transform(code: string, id: string) {
        if (id.endsWith('.svg')) {
          return `const React = require('react'); export default React.createElement('svg', { dangerouslySetInnerHTML: { __html: ${JSON.stringify(code.replace(/<svg[^>]*>/, '').replace('</svg>', ''))} } });`
        }
      }
    }
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['**/*.{test,spec}.{ts,tsx}', '**/__tests__/**'],
    exclude: ['node_modules', '.next', 'dist', 'e2e/**'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules', '.next', 'dist', 'vitest.setup.ts', 'next-env.d.ts']
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './')
    }
  }
})
