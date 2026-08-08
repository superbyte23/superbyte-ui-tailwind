import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { readdirSync } from 'node:fs'

const __dirname = dirname(fileURLToPath(import.meta.url))

function htmlInputs() {
  const inputs = { index: resolve(__dirname, 'index.html') }
  for (const f of readdirSync(resolve(__dirname, 'preview'))) {
    if (f.endsWith('.html')) {
      inputs[f.replace(/\.html$/, '')] = resolve(__dirname, 'preview', f)
    }
  }
  return inputs
}

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    rollupOptions: {
      input: htmlInputs(),
    },
    target: 'es2020',
  },
  server: {
    port: 8765,
  },
})
