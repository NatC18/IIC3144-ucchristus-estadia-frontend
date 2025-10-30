import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true, // use global test functions like 'describe', 'it'
    environment: 'jsdom', // simulate browser environment
    setupFiles: './src/setupTests.ts', // optional, for global setup
    coverage: {
      reporter: ['text', 'html'], // optional, code coverage
    },
  },
  server: {
    port: 5174,
  },
})
