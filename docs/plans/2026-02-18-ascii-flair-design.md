# ascii-flair Design Document

**Date:** 2026-02-18
**Status:** Approved

## Overview

ascii-flair is an npm module that adds ASCII art and styled text to `console.log` for any web app or Node.js project. It is framework-agnostic, works in both browser and terminal environments, and is designed for minimal bundle impact.

## Goals

- Provide a simple API to render ASCII art fonts and styled plain text to the console
- Framework-agnostic: works with Vue/Nuxt, React/Next, Angular, plain Node.js, etc.
- Minimal bundle size: ~1-2KB core, ~1-2KB per font (lazy-loaded)
- Zero runtime dependency on figlet — fonts are pre-compiled at ascii-flair's build time
- One-command build, version bump, and publish to npm
- ES module first, with CJS fallback

## API Design

```js
import { flair } from 'ascii-flair'

// ASCII art mode — renders text in a pre-compiled figlet font
flair('My App', 'flair', 'standard')

// Styled plain text mode — colors, borders, bold
flair('v2.0 loaded', 'text')

// Options object for styling (both modes)
flair('My App', 'flair', 'standard', {
  color: 'cyan',
  border: true,
  padding: 1
})

flair('Server started on :3000', 'text', {
  color: 'green',
  bold: true,
  border: true
})
```

### Function Signature

```
flair(text, mode, fontOrOptions?, options?)
```

- `text` (string) — the text to render
- `mode` ('flair' | 'text') — ASCII art or styled plain text
- `fontOrOptions` (string | object) — font name when mode is 'flair', or options object when mode is 'text'
- `options` (object, optional) — styling options when mode is 'flair'

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| color | string | none | Text color (cyan, green, red, yellow, blue, magenta, white) |
| bold | boolean | false | Bold text (terminal only, ignored in browser) |
| border | boolean | false | Wrap output in a box border |
| padding | number | 0 | Lines of padding around text |

### Environment Detection

- **Browser:** Uses `%c` CSS styling in `console.log` for colors
- **Terminal:** Uses ANSI escape codes for colors and bold
- Detection via `typeof window !== 'undefined'`

## Architecture

```
ascii-flair/
├── src/
│   ├── index.js          # Main entry — exports flair()
│   ├── renderer.js       # Minimal ASCII art renderer (~0.5KB)
│   ├── styles.js         # Text styling (colors, borders, bold)
│   └── detect.js         # Browser vs terminal detection
├── fonts/                # Pre-compiled font data (JS modules)
│   ├── standard.js
│   ├── big.js
│   ├── slant.js
│   └── ...               # ~15-20 curated fonts
├── scripts/
│   ├── compile-fonts.js  # Uses figlet (devDep) to generate font data
│   └── generate-readme.js # Renders font gallery for README
├── dist/                 # Vite library mode output
│   ├── ascii-flair.es.js # ESM bundle
│   └── ascii-flair.cjs   # CJS bundle
├── vite.config.js
├── package.json
└── README.md             # Includes visual font gallery
```

### Key Architectural Decisions

1. **Pre-compiled fonts:** figlet is a devDependency only. `scripts/compile-fonts.js` uses figlet to extract font character maps and converts them into a compact format. The published npm package contains zero figlet code.

2. **Custom minimal renderer:** Instead of shipping figlet's ~15KB core, we write a ~0.5KB renderer that reads our pre-compiled font format. It maps each character to its multi-line ASCII representation and assembles them horizontally.

3. **Per-font lazy loading:** Each font is a separate ES module under `fonts/`. When `flair('x', 'flair', 'standard')` is called, it dynamically imports `fonts/standard.js`. Bundlers automatically code-split this into a separate chunk. Unused fonts cost zero bytes.

4. **Environment auto-detection:** `detect.js` checks `typeof window` to choose between CSS-based browser styling and ANSI terminal styling. No configuration required.

5. **sideEffects: false:** Enables full tree-shaking. If a consumer only uses text mode, no font code is included.

## Bundle Size Budget

| Import | Gzipped Size |
|--------|-------------|
| Core (flair + text mode) | ~1-2KB |
| Per font (lazy-loaded on first use) | ~1-2KB each |
| Worst case (core + 1 font) | ~3-4KB |

## Curated Font List (~15-20)

### Clean / Classic
- Standard
- Big
- Small

### Bold / Impact
- Banner
- Block
- Doom

### Decorative
- Slant
- Shadow
- Isometric1

### Compact
- Mini
- Short
- Thin

### Fun
- Bubble
- Digital
- Graffiti

### Monospace
- ANSI Regular
- Cybermedium
- Rectangles

Each font will have a rendered example in the README showing the word "Hello" or "Flair" in that font.

## Build & Publish Pipeline

### package.json Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "build:fonts": "node scripts/compile-fonts.js",
    "build:readme": "node scripts/generate-readme.js",
    "prepublishOnly": "npm run build:fonts && npm run build:readme && npm run build",
    "release:patch": "npm version patch && npm publish",
    "release:minor": "npm version minor && npm publish",
    "release:major": "npm version major && npm publish"
  }
}
```

### Release Flow

1. `npm run release:patch` (or minor/major)
2. `npm version` bumps version in package.json and creates a git tag
3. `prepublishOnly` hook fires automatically:
   - Compiles fonts from figlet source → `fonts/`
   - Generates README font gallery
   - Runs Vite library build → `dist/`
4. `npm publish` pushes to npm registry

### package.json Exports

```json
{
  "name": "ascii-flair",
  "version": "0.1.0",
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
  "files": ["dist"],
  "sideEffects": false,
  "devDependencies": {
    "figlet": "^1.x",
    "vite": "^6.x"
  }
}
```

## Consumer Usage

### Installation

```bash
npm install ascii-flair
```

### ES Module Import

```js
import { flair } from 'ascii-flair'

// ASCII art in the console
flair('My App', 'flair', 'standard')

// Styled plain text
flair('Ready to go!', 'text', { color: 'green', border: true })
```

### CommonJS (Node.js)

```js
const { flair } = require('ascii-flair')

flair('Server Started', 'flair', 'doom', { color: 'cyan' })
```

### Works everywhere

- Nuxt 4 (`nuxt generate`, `nuxt dev`, SSR)
- Next.js
- Vue + Vite
- React + Vite/CRA
- Angular
- Plain Node.js scripts
- Any ES module environment
