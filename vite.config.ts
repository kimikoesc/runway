// Vite config: builds the app and also configures Vitest (the test runner).
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom', // fake browser DOM so components can render in tests
    globals: true, // describe/it/expect available without importing
    setupFiles: './src/test/setup.ts',
  },
})
