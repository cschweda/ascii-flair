import { defineConfig } from 'vite'
import { resolve, dirname } from 'path'
import { readdirSync } from 'fs'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Collect font entry points dynamically
function getFontEntries() {
  const fontsDir = resolve(__dirname, 'src/fonts')
  try {
    return Object.fromEntries(
      readdirSync(fontsDir)
        .filter(f => f.endsWith('.js'))
        .map(f => [`fonts/${f.replace('.js', '')}`, resolve(fontsDir, f)])
    )
  } catch {
    return {}
  }
}

export default defineConfig({
  build: {
    lib: {
      entry: {
        'ascii-flair': resolve(__dirname, 'src/index.js'),
        ...getFontEntries()
      },
      formats: ['es', 'cjs']
    },
    rollupOptions: {
      output: [
        {
          format: 'es',
          entryFileNames: '[name].es.js',
          chunkFileNames: '[name].es.js',
          dir: 'dist'
        },
        {
          format: 'cjs',
          entryFileNames: '[name].cjs',
          chunkFileNames: '[name].cjs',
          dir: 'dist'
        }
      ]
    },
    minify: true,
    emptyOutDir: true
  },
  test: {
    globals: true
  }
})
