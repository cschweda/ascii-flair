# ascii-flair Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build and publish `ascii-flair`, a minimal npm module for rendering ASCII art and styled text to console.log in any JS environment.

**Architecture:** Pre-compiled figlet fonts (devDep only) + minimal custom renderer + lazy-loaded per-font modules. Core ~1-2KB, each font ~1-2KB. Framework-agnostic ES module with CJS fallback via Vite library mode.

**Tech Stack:** Plain JavaScript, Vite (library mode), Vitest (testing), figlet (devDep for font compilation)

---

### Task 1: Project Scaffolding

**Files:**
- Create: `package.json`
- Create: `.gitignore`

**Step 1: Initialize package.json**

```bash
cd /Volumes/satechi/webdev/ascii-flair
npm init -y
```

Then edit `package.json` to:

```json
{
  "name": "ascii-flair",
  "version": "0.1.0",
  "description": "Minimal ASCII art and styled text for console.log — works everywhere",
  "type": "module",
  "main": "./dist/ascii-flair.cjs",
  "module": "./dist/ascii-flair.es.js",
  "exports": {
    ".": {
      "import": "./dist/ascii-flair.es.js",
      "require": "./dist/ascii-flair.cjs"
    },
    "./fonts/*": "./dist/fonts/*.js"
  },
  "files": [
    "dist"
  ],
  "sideEffects": false,
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "build:fonts": "node scripts/compile-fonts.js",
    "build:readme": "node scripts/generate-readme.js",
    "test": "vitest run",
    "test:watch": "vitest",
    "prepublishOnly": "npm run build:fonts && npm run build:readme && npm run build",
    "release:patch": "npm version patch && npm publish",
    "release:minor": "npm version minor && npm publish",
    "release:major": "npm version major && npm publish"
  },
  "keywords": [
    "ascii",
    "ascii-art",
    "figlet",
    "console",
    "terminal",
    "flair",
    "banner",
    "styled-text"
  ],
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": ""
  }
}
```

**Step 2: Create .gitignore**

```
node_modules/
dist/
*.log
.DS_Store
```

**Step 3: Install dev dependencies**

```bash
npm install --save-dev vite vitest figlet
```

**Step 4: Commit**

```bash
git add package.json package-lock.json .gitignore
git commit -m "chore: scaffold project with package.json and dependencies"
```

---

### Task 2: Vite Library Build Configuration

**Files:**
- Create: `vite.config.js`
- Create: `src/index.js` (placeholder)

**Step 1: Create vite.config.js**

```js
import { defineConfig } from 'vite'
import { resolve } from 'path'
import { readdirSync } from 'fs'

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
```

**Step 2: Create placeholder src/index.js**

```js
export function flair() {
  // placeholder
}
```

**Step 3: Verify build runs**

```bash
npx vite build
```

Expected: Build completes, creates `dist/ascii-flair.es.js` and `dist/ascii-flair.cjs`.

**Step 4: Commit**

```bash
git add vite.config.js src/index.js
git commit -m "chore: add Vite library build configuration"
```

---

### Task 3: Environment Detection

**Files:**
- Create: `src/detect.js`
- Create: `tests/detect.test.js`

**Step 1: Write the failing test**

```js
// tests/detect.test.js
import { describe, it, expect, vi } from 'vitest'
import { isBrowser } from '../src/detect.js'

describe('detect', () => {
  it('returns false in Node.js environment', () => {
    expect(isBrowser()).toBe(false)
  })
})
```

**Step 2: Run test to verify it fails**

```bash
npx vitest run tests/detect.test.js
```

Expected: FAIL — cannot find module `../src/detect.js`

**Step 3: Write implementation**

```js
// src/detect.js
export function isBrowser() {
  return typeof window !== 'undefined' && typeof window.document !== 'undefined'
}
```

**Step 4: Run test to verify it passes**

```bash
npx vitest run tests/detect.test.js
```

Expected: PASS

**Step 5: Commit**

```bash
git add src/detect.js tests/detect.test.js
git commit -m "feat: add environment detection module"
```

---

### Task 4: Text Styling — ANSI Terminal Colors

**Files:**
- Create: `src/styles.js`
- Create: `tests/styles.test.js`

**Step 1: Write the failing tests**

```js
// tests/styles.test.js
import { describe, it, expect } from 'vitest'
import { applyAnsiColor, applyBorder, applyPadding } from '../src/styles.js'

describe('applyAnsiColor', () => {
  it('wraps text in cyan ANSI codes', () => {
    const result = applyAnsiColor('hello', 'cyan')
    expect(result).toBe('\x1b[36mhello\x1b[0m')
  })

  it('wraps text in green ANSI codes', () => {
    const result = applyAnsiColor('hello', 'green')
    expect(result).toBe('\x1b[32mhello\x1b[0m')
  })

  it('wraps text in bold ANSI codes', () => {
    const result = applyAnsiColor('hello', null, true)
    expect(result).toBe('\x1b[1mhello\x1b[0m')
  })

  it('returns text unchanged with no color or bold', () => {
    const result = applyAnsiColor('hello')
    expect(result).toBe('hello')
  })
})

describe('applyBorder', () => {
  it('wraps single line in a box border', () => {
    const result = applyBorder('hello')
    const lines = result.split('\n')
    expect(lines[0]).toBe('┌───────┐')
    expect(lines[1]).toBe('│ hello │')
    expect(lines[2]).toBe('└───────┘')
  })

  it('wraps multi-line text in a box border', () => {
    const result = applyBorder('hi\nthere')
    const lines = result.split('\n')
    expect(lines[0]).toBe('┌───────┐')
    expect(lines[1]).toBe('│ hi    │')
    expect(lines[2]).toBe('│ there │')
    expect(lines[3]).toBe('└───────┘')
  })
})

describe('applyPadding', () => {
  it('adds empty lines above and below', () => {
    const result = applyPadding('hello', 1)
    expect(result).toBe('\nhello\n')
  })

  it('adds multiple lines of padding', () => {
    const result = applyPadding('hello', 2)
    expect(result).toBe('\n\nhello\n\n')
  })

  it('returns text unchanged with 0 padding', () => {
    const result = applyPadding('hello', 0)
    expect(result).toBe('hello')
  })
})
```

**Step 2: Run tests to verify they fail**

```bash
npx vitest run tests/styles.test.js
```

Expected: FAIL — cannot find module

**Step 3: Write implementation**

```js
// src/styles.js

const ANSI_COLORS = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
}

const ANSI_BOLD = '\x1b[1m'
const ANSI_RESET = '\x1b[0m'

export function applyAnsiColor(text, color, bold) {
  let prefix = ''
  if (bold) prefix += ANSI_BOLD
  if (color && ANSI_COLORS[color]) prefix += ANSI_COLORS[color]
  if (!prefix) return text
  return `${prefix}${text}${ANSI_RESET}`
}

export function applyBorder(text) {
  const lines = text.split('\n')
  const maxLen = Math.max(...lines.map(l => l.length))
  const top = `┌${'─'.repeat(maxLen + 2)}┐`
  const bottom = `└${'─'.repeat(maxLen + 2)}┘`
  const bordered = lines.map(l => `│ ${l.padEnd(maxLen)} │`)
  return [top, ...bordered, bottom].join('\n')
}

export function applyPadding(text, padding) {
  if (!padding) return text
  const pad = '\n'.repeat(padding)
  return `${pad}${text}${pad}`
}

export function formatBrowser(text, options = {}) {
  const styles = []
  if (options.color) styles.push(`color: ${options.color}`)
  if (options.bold) styles.push('font-weight: bold')
  if (options.border) {
    text = applyBorder(text)
  }
  if (options.padding) {
    text = applyPadding(text, options.padding)
  }
  if (styles.length) {
    return { text: `%c${text}`, css: styles.join('; ') }
  }
  return { text, css: null }
}

export function formatTerminal(text, options = {}) {
  if (options.border) {
    text = applyBorder(text)
  }
  if (options.padding) {
    text = applyPadding(text, options.padding)
  }
  text = applyAnsiColor(text, options.color, options.bold)
  return text
}
```

**Step 4: Run tests to verify they pass**

```bash
npx vitest run tests/styles.test.js
```

Expected: PASS (all 8 tests)

**Step 5: Commit**

```bash
git add src/styles.js tests/styles.test.js
git commit -m "feat: add text styling with ANSI colors, borders, and padding"
```

---

### Task 5: Font Compilation Script

**Files:**
- Create: `scripts/compile-fonts.js`
- Create: `src/fonts/` directory

**Step 1: Write the font compilation script**

This script uses figlet (devDependency) to extract character maps from figlet font files and saves them as compact JS modules.

```js
// scripts/compile-fonts.js
import figlet from 'figlet'
import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const FONTS_DIR = resolve(__dirname, '../src/fonts')

// Curated font list
const FONTS = [
  'Standard',
  'Big',
  'Small',
  'Banner',
  'Block',
  'Doom',
  'Slant',
  'Shadow',
  'Isometric1',
  'Mini',
  'Short',
  'Thin',
  'Bubble',
  'Digital',
  'Graffiti',
  'ANSI Regular',
  'Cybermedium',
  'Rectangles'
]

// Characters to include in font data
const CHARS = ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~'

function extractFont(fontName) {
  return new Promise((resolve, reject) => {
    const charMap = {}
    let height = 0

    // Render each character individually to extract its pattern
    let pending = CHARS.length
    for (const char of CHARS) {
      figlet.text(char, { font: fontName }, (err, result) => {
        if (err) {
          // Skip characters that fail
          pending--
          if (pending === 0) resolve({ charMap, height })
          return
        }
        const lines = result.split('\n')
        // Remove trailing empty lines
        while (lines.length && lines[lines.length - 1].trim() === '') {
          lines.pop()
        }
        if (lines.length > height) height = lines.length
        charMap[char] = lines
        pending--
        if (pending === 0) resolve({ charMap, height })
      })
    }
  })
}

async function compileFont(fontName) {
  console.log(`Compiling: ${fontName}`)
  const { charMap, height } = await extractFont(fontName)

  // Normalize all characters to same height
  for (const char of Object.keys(charMap)) {
    while (charMap[char].length < height) {
      charMap[char].push('')
    }
  }

  const safeName = fontName.toLowerCase().replace(/\s+/g, '-')
  const moduleContent = `// Pre-compiled font: ${fontName}
// Generated by ascii-flair compile-fonts.js — do not edit
export default ${JSON.stringify({ name: fontName, height, chars: charMap })}\n`

  const outPath = resolve(FONTS_DIR, `${safeName}.js`)
  writeFileSync(outPath, moduleContent, 'utf8')
  console.log(`  → src/fonts/${safeName}.js`)
}

async function main() {
  if (!existsSync(FONTS_DIR)) {
    mkdirSync(FONTS_DIR, { recursive: true })
  }

  // Generate font index
  const fontEntries = []

  for (const font of FONTS) {
    try {
      await compileFont(font)
      const safeName = font.toLowerCase().replace(/\s+/g, '-')
      fontEntries.push({ name: font, file: safeName })
    } catch (err) {
      console.warn(`  ⚠ Skipping ${font}: ${err.message}`)
    }
  }

  // Write font registry
  const registryContent = `// Auto-generated font registry — do not edit
export const FONT_REGISTRY = ${JSON.stringify(
    Object.fromEntries(fontEntries.map(f => [f.file, f.name]))
  , null, 2)}\n\nexport const FONT_NAMES = ${JSON.stringify(fontEntries.map(f => f.file))}\n`

  writeFileSync(resolve(FONTS_DIR, '_registry.js'), registryContent, 'utf8')
  console.log(`\nCompiled ${fontEntries.length} fonts.`)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
```

**Step 2: Run the compilation script**

```bash
mkdir -p src/fonts
node scripts/compile-fonts.js
```

Expected: Outputs `src/fonts/standard.js`, `src/fonts/big.js`, etc. plus `src/fonts/_registry.js`.

**Step 3: Verify a compiled font file looks correct**

```bash
head -5 src/fonts/standard.js
```

Expected: JSON object with `name`, `height`, and `chars` keys.

**Step 4: Commit**

```bash
git add scripts/compile-fonts.js src/fonts/
git commit -m "feat: add font compilation script and pre-compiled fonts"
```

---

### Task 6: Minimal ASCII Art Renderer

**Files:**
- Create: `src/renderer.js`
- Create: `tests/renderer.test.js`

**Step 1: Write the failing test**

```js
// tests/renderer.test.js
import { describe, it, expect } from 'vitest'
import { renderAscii } from '../src/renderer.js'

// Minimal mock font for testing
const mockFont = {
  name: 'Mock',
  height: 3,
  chars: {
    'H': ['H H', 'HHH', 'H H'],
    'i': [' . ', ' i ', ' i '],
    ' ': ['   ', '   ', '   ']
  }
}

describe('renderAscii', () => {
  it('renders a single character', () => {
    const result = renderAscii('H', mockFont)
    expect(result).toBe('H H\nHHH\nH H')
  })

  it('renders multiple characters side by side', () => {
    const result = renderAscii('Hi', mockFont)
    expect(result).toBe('H H . \nHHH i \nH H i ')
  })

  it('falls back to space for unknown characters', () => {
    const result = renderAscii('H?', mockFont)
    // '?' is unknown, should render as space
    expect(result).toBe('H H   \nHHH   \nH H   ')
  })
})
```

**Step 2: Run test to verify it fails**

```bash
npx vitest run tests/renderer.test.js
```

Expected: FAIL

**Step 3: Write implementation**

```js
// src/renderer.js

export function renderAscii(text, fontData) {
  const { height, chars } = fontData
  const fallback = chars[' '] || Array(height).fill('')

  const lines = Array.from({ length: height }, () => '')

  for (const char of text) {
    const charLines = chars[char] || fallback
    for (let row = 0; row < height; row++) {
      lines[row] += charLines[row] || ''
    }
  }

  return lines.join('\n')
}
```

**Step 4: Run test to verify it passes**

```bash
npx vitest run tests/renderer.test.js
```

Expected: PASS (all 3 tests)

**Step 5: Commit**

```bash
git add src/renderer.js tests/renderer.test.js
git commit -m "feat: add minimal ASCII art renderer"
```

---

### Task 7: Main flair() API

**Files:**
- Modify: `src/index.js`
- Create: `tests/index.test.js`

**Step 1: Write the failing tests**

```js
// tests/index.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flair } from '../src/index.js'

describe('flair', () => {
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  it('logs styled plain text in text mode', () => {
    flair('hello', 'text')
    expect(console.log).toHaveBeenCalledWith('hello')
  })

  it('logs plain text with border', () => {
    flair('hello', 'text', { border: true })
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('┌')
    )
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('hello')
    )
  })

  it('logs plain text with ANSI color in terminal', () => {
    flair('hello', 'text', { color: 'cyan' })
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('\x1b[36m')
    )
  })

  it('logs ASCII art in flair mode', async () => {
    // This test uses actual pre-compiled fonts
    await flair('Hi', 'flair', 'standard')
    expect(console.log).toHaveBeenCalled()
    const output = console.log.mock.calls[0][0]
    // ASCII art should be multi-line
    expect(output.split('\n').length).toBeGreaterThan(1)
  })

  it('throws on unknown mode', () => {
    expect(() => flair('hello', 'invalid')).toThrow()
  })
})
```

**Step 2: Run test to verify it fails**

```bash
npx vitest run tests/index.test.js
```

Expected: FAIL

**Step 3: Write implementation**

```js
// src/index.js
import { isBrowser } from './detect.js'
import { formatBrowser, formatTerminal } from './styles.js'
import { renderAscii } from './renderer.js'

// Cache loaded fonts
const fontCache = new Map()

async function loadFont(name) {
  if (fontCache.has(name)) return fontCache.get(name)

  try {
    // Dynamic import of pre-compiled font module
    const mod = await import(`./fonts/${name}.js`)
    const fontData = mod.default
    fontCache.set(name, fontData)
    return fontData
  } catch {
    throw new Error(`ascii-flair: unknown font "${name}". Check available fonts in the README.`)
  }
}

export async function flair(text, mode, fontOrOptions, options) {
  if (mode === 'text') {
    const opts = (typeof fontOrOptions === 'object') ? fontOrOptions : (options || {})
    return outputText(text, opts)
  }

  if (mode === 'flair') {
    const fontName = (typeof fontOrOptions === 'string') ? fontOrOptions : 'standard'
    const opts = options || {}
    const fontData = await loadFont(fontName)
    const rendered = renderAscii(text, fontData)
    return outputText(rendered, opts)
  }

  throw new Error(`ascii-flair: unknown mode "${mode}". Use "flair" or "text".`)
}

function outputText(text, options) {
  if (isBrowser()) {
    const { text: formatted, css } = formatBrowser(text, options)
    if (css) {
      console.log(formatted, css)
    } else {
      console.log(formatted)
    }
  } else {
    const formatted = formatTerminal(text, options)
    console.log(formatted)
  }
}
```

**Step 4: Run test to verify it passes**

```bash
npx vitest run tests/index.test.js
```

Expected: PASS (all 5 tests)

**Step 5: Run all tests**

```bash
npx vitest run
```

Expected: All tests pass across all files.

**Step 6: Commit**

```bash
git add src/index.js tests/index.test.js
git commit -m "feat: implement main flair() API with text and flair modes"
```

---

### Task 8: README Generation Script

**Files:**
- Create: `scripts/generate-readme.js`

**Step 1: Write the README generation script**

```js
// scripts/generate-readme.js
import figlet from 'figlet'
import { writeFileSync, readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')

const FONTS = [
  { name: 'Standard', file: 'standard', category: 'Clean / Classic' },
  { name: 'Big', file: 'big', category: 'Clean / Classic' },
  { name: 'Small', file: 'small', category: 'Clean / Classic' },
  { name: 'Banner', file: 'banner', category: 'Bold / Impact' },
  { name: 'Block', file: 'block', category: 'Bold / Impact' },
  { name: 'Doom', file: 'doom', category: 'Bold / Impact' },
  { name: 'Slant', file: 'slant', category: 'Decorative' },
  { name: 'Shadow', file: 'shadow', category: 'Decorative' },
  { name: 'Isometric1', file: 'isometric1', category: 'Decorative' },
  { name: 'Mini', file: 'mini', category: 'Compact' },
  { name: 'Short', file: 'short', category: 'Compact' },
  { name: 'Thin', file: 'thin', category: 'Compact' },
  { name: 'Bubble', file: 'bubble', category: 'Fun' },
  { name: 'Digital', file: 'digital', category: 'Fun' },
  { name: 'Graffiti', file: 'graffiti', category: 'Fun' },
  { name: 'ANSI Regular', file: 'ansi-regular', category: 'Monospace' },
  { name: 'Cybermedium', file: 'cybermedium', category: 'Monospace' },
  { name: 'Rectangles', file: 'rectangles', category: 'Monospace' }
]

function renderFont(fontName) {
  return new Promise((resolve, reject) => {
    figlet.text('Hello', { font: fontName }, (err, result) => {
      if (err) reject(err)
      else resolve(result)
    })
  })
}

async function main() {
  let fontGallery = ''
  let currentCategory = ''

  for (const font of FONTS) {
    if (font.category !== currentCategory) {
      currentCategory = font.category
      fontGallery += `\n#### ${currentCategory}\n`
    }

    try {
      const rendered = await renderFont(font.name)
      fontGallery += `\n**${font.name}** (\`${font.file}\`)\n\`\`\`\n${rendered}\n\`\`\`\n`
    } catch {
      fontGallery += `\n**${font.name}** (\`${font.file}\`) — *rendering failed*\n`
    }
  }

  const readme = `# ascii-flair

Minimal ASCII art and styled text for \`console.log\` — works everywhere.

- **~1-2KB** core (text mode)
- **~1-2KB** per font (lazy-loaded on demand)
- **Zero runtime dependencies** — fonts are pre-compiled
- Works in **browser** and **terminal**
- Framework-agnostic: Vue, React, Angular, Nuxt, Next, plain Node.js

## Install

\`\`\`bash
npm install ascii-flair
\`\`\`

## Usage

\`\`\`js
import { flair } from 'ascii-flair'

// ASCII art mode
flair('My App', 'flair', 'standard')

// ASCII art with styling
flair('My App', 'flair', 'doom', { color: 'cyan', border: true })

// Styled plain text
flair('Server started on :3000', 'text', { color: 'green', bold: true })

// Plain text with border
flair('v2.0', 'text', { border: true, padding: 1 })
\`\`\`

## API

\`\`\`
flair(text, mode, fontOrOptions?, options?)
\`\`\`

| Parameter | Type | Description |
|-----------|------|-------------|
| \`text\` | string | The text to render |
| \`mode\` | \`'flair'\` \\| \`'text'\` | ASCII art or styled plain text |
| \`fontOrOptions\` | string \\| object | Font name (flair mode) or options (text mode) |
| \`options\` | object | Styling options (flair mode) |

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| \`color\` | string | — | \`cyan\`, \`green\`, \`red\`, \`yellow\`, \`blue\`, \`magenta\`, \`white\` |
| \`bold\` | boolean | \`false\` | Bold text (terminal only) |
| \`border\` | boolean | \`false\` | Wrap in a box border |
| \`padding\` | number | \`0\` | Lines of padding around text |

> **Note:** \`flair()\` returns a Promise in \`'flair'\` mode (fonts are lazy-loaded). In \`'text'\` mode it is synchronous.

## Available Fonts
${fontGallery}

## License

MIT
`

  writeFileSync(resolve(ROOT, 'README.md'), readme, 'utf8')
  console.log('README.md generated with font gallery.')
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
```

**Step 2: Run the script**

```bash
node scripts/generate-readme.js
```

Expected: Creates `README.md` with rendered font examples.

**Step 3: Verify README looks correct**

```bash
head -60 README.md
```

Expected: Header, install instructions, usage examples, and font gallery with ASCII art previews.

**Step 4: Commit**

```bash
git add scripts/generate-readme.js README.md
git commit -m "feat: add README generation script with font gallery"
```

---

### Task 9: Full Build Verification

**Files:**
- No new files — verification only

**Step 1: Run the full prepublish pipeline**

```bash
npm run build:fonts && npm run build:readme && npm run build
```

Expected: All three steps succeed.

**Step 2: Verify dist output**

```bash
ls -la dist/
ls -la dist/fonts/ 2>/dev/null || echo "Check if fonts are in dist"
```

Expected: `dist/ascii-flair.es.js`, `dist/ascii-flair.cjs`, and font files.

**Step 3: Check bundle size**

```bash
wc -c dist/ascii-flair.es.js
gzip -c dist/ascii-flair.es.js | wc -c
```

Expected: Core ESM bundle < 5KB raw, < 2KB gzipped.

**Step 4: Test the built module works**

Create a quick smoke test:

```bash
node -e "import('./dist/ascii-flair.es.js').then(m => m.flair('Test', 'text', { color: 'green', border: true }))"
```

Expected: Prints styled bordered "Test" in green.

**Step 5: Run all tests one final time**

```bash
npx vitest run
```

Expected: All tests pass.

**Step 6: Commit any adjustments**

If the Vite config needed tweaks for font output paths, commit those changes.

```bash
git add -A
git commit -m "chore: verify full build pipeline"
```

---

### Task 10: Publish Pipeline Verification

**Files:**
- No new files — verify `npm publish --dry-run` works

**Step 1: Verify npm auth**

```bash
npm whoami
```

Expected: Shows your npm username.

**Step 2: Dry-run publish**

```bash
npm publish --dry-run
```

Expected: Shows what would be published. Verify only `dist/` files are included (no `src/`, `scripts/`, `node_modules/`).

**Step 3: Verify release scripts work**

```bash
npm version patch --no-git-tag-version
# Check package.json shows 0.1.1
# Reset:
npm version 0.1.0 --no-git-tag-version --allow-same-version
```

Expected: Version bumps correctly.

**Step 4: Commit final state**

```bash
git add -A
git commit -m "chore: verify publish pipeline"
```

---

### Task 11: First Publish

**Step 1: Publish to npm**

```bash
npm run release:patch
```

This runs: `npm version patch` → `prepublishOnly` (build:fonts → build:readme → build) → `npm publish`.

Expected: Package published to npm as `ascii-flair@0.1.1`.

**Step 2: Verify on npm**

```bash
npm view ascii-flair
```

Expected: Shows package info.

**Step 3: Test installation in a fresh project**

```bash
cd /tmp && mkdir test-flair && cd test-flair
npm init -y
npm install ascii-flair
node -e "import('ascii-flair').then(m => m.flair('It works!', 'text', { color: 'cyan', border: true }))"
```

Expected: Prints styled "It works!" message.

**Step 4: Tag and push**

```bash
cd /Volumes/satechi/webdev/ascii-flair
git push origin main --tags
```
