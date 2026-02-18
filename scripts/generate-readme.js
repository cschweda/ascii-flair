// scripts/generate-readme.js
import figlet from 'figlet'
import { writeFileSync } from 'fs'
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

This doesn't solve a problem. It won't make your app faster or your code cleaner. It's just a bit of whimsical flair for your console — because sometimes the best reason to build something is that it makes you smile.

- **~1-2KB** core (text mode)
- **~1-2KB** per font (lazy-loaded on demand)
- **Zero runtime dependencies** — fonts are pre-compiled
- Works in **browser** and **terminal**
- Framework-agnostic: Vue, React, Angular, Nuxt, Next, plain Node.js

## Install

\`\`\`bash
npm install ascii-flair
\`\`\`

## Zero Impact

ascii-flair writes to \`console.log\` and nothing else. It does not touch the DOM, modify state, inject styles, or affect your application in any way. It's a dev console novelty — your users will never see it, and your app will never feel it.

The entire core is **~1-2KB gzipped**. Each font adds another ~1-2KB, loaded on demand. That's it.

## Dependencies & Size

ascii-flair has **zero runtime dependencies**. None. When you \`npm install ascii-flair\`, nothing else comes with it.

Fonts are pre-compiled at build time using [figlet](https://www.npmjs.com/package/figlet), which is a **devDependency only** — it never ships to your users. The compiled fonts are compact JSON-like JavaScript modules that get lazy-loaded on demand.

| What | Size (gzipped) |
|------|---------------|
| Core (\`flair()\` + text mode) | ~1.7 KB |
| One font (e.g. \`standard\`) | ~1-2 KB |
| Total for a typical call | ~3 KB |

For comparison, that's smaller than most single SVG icons.

**Framework-agnostic by design.** ascii-flair is plain JavaScript with no framework bindings, no peer dependencies, and no special build plugins. It works anywhere JavaScript runs:

- **Vue / Nuxt** — call it in \`onMounted\`, a plugin, or \`main.js\`
- **React / Next** — call it in \`useEffect\`, a layout, or an entry file
- **Angular** — call it in \`ngOnInit\` or a service
- **Svelte / SvelteKit** — call it in \`onMount\` or a server hook
- **Plain Node.js / CLI tools** — call it at the top of your script
- **Vanilla browser** — call it in a \`<script type="module">\`

It uses standard ES module \`import\` and dynamic \`import()\` for font loading — both are part of the JavaScript language, not tied to any bundler or framework. Vite, webpack, Rollup, esbuild, Turbopack — they all handle it natively.

## Usage

\`\`\`js
import { flair } from 'ascii-flair'

// ASCII art mode
await flair('My App', 'flair', 'standard')

// ASCII art with styling
await flair('My App', 'flair', 'doom', { color: 'cyan', border: true })

// Styled plain text
flair('Server started on :3000', 'text', { color: 'green', bold: true })

// Plain text with border
flair('v2.0', 'text', { border: true, padding: 1 })
\`\`\`

### Why \`await\`?

In \`'flair'\` mode, fonts are **lazy-loaded** the first time you use them. This keeps the initial bundle tiny — you only pay for the fonts you actually use. The trade-off is that the first call with a given font returns a Promise.

\`\`\`js
// flair mode → async (font must be loaded)
await flair('Hello', 'flair', 'doom')

// text mode → synchronous (no font needed)
flair('Hello', 'text')
\`\`\`

**What if you skip \`await\`?** It still works. The text will appear in the console. But if you have multiple \`flair()\` calls, they may print out of order because the font loads haven't resolved yet. Use \`await\` when ordering matters:

\`\`\`js
// These will always print in order
await flair('My App', 'flair', 'doom')
await flair('v2.0', 'flair', 'mini')
flair('Ready to go!', 'text', { color: 'green' })
\`\`\`

After a font loads once, it's cached — subsequent calls with the same font resolve instantly.

### In the Browser (Vue, React, Angular, etc.)

Open your browser's DevTools console. That's where the output goes. Your users never see it. Your app's rendering, state, and performance are completely unaffected.

\`\`\`js
// React — in a useEffect, component mount, wherever
import { flair } from 'ascii-flair'

useEffect(() => {
  flair('My React App', 'flair', 'doom')
  flair('v3.1.0', 'text', { color: 'cyan' })
}, [])
\`\`\`

\`\`\`js
// Vue — in a plugin, onMounted, main.js, wherever
import { flair } from 'ascii-flair'

onMounted(() => {
  flair('My Vue App', 'flair', 'standard')
})
\`\`\`

\`\`\`js
// Nuxt — in a plugin
export default defineNuxtPlugin(() => {
  flair('My Nuxt App', 'flair', 'slant')
})
\`\`\`

In browser contexts, colors render as CSS-styled \`console.log\` output.

### In the Terminal (Node.js, CLI tools)

\`\`\`js
// Node.js — at startup, in a CLI, wherever
import { flair } from 'ascii-flair'

await flair('my-cli', 'flair', 'doom', { color: 'cyan' })
flair('v1.0.0 ready', 'text', { color: 'green', bold: true })
\`\`\`

In terminal contexts, colors render as ANSI escape codes.

### Auto-Truncation

Output is automatically capped at **80 characters wide** by default. In flair mode, characters that would push the ASCII art past the limit are dropped. In text mode, long lines are truncated with an ellipsis (\`\u2026\`).

You can customize the width with \`maxWidth\`:

\`\`\`js
// Narrow output (40 chars)
flair('Hello World', 'flair', 'standard', { maxWidth: 40 })

// Wider output (120 chars)
flair('Hello World', 'flair', 'standard', { maxWidth: 120 })

// Text mode also respects maxWidth
flair('A very long message...', 'text', { maxWidth: 50 })
\`\`\`

Keep your text short \u2014 shorter is better. The auto-truncation is a safety net, not a design tool.

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
| \`color\` | string | \u2014 | \`cyan\`, \`green\`, \`red\`, \`yellow\`, \`blue\`, \`magenta\`, \`white\` |
| \`bold\` | boolean | \`false\` | Bold text (terminal only) |
| \`border\` | boolean | \`false\` | Wrap in a box border |
| \`padding\` | number | \`0\` | Lines of padding around text |
| \`maxWidth\` | number | \`80\` | Max output width in characters. Text beyond this is truncated. |

> **Note:** \`flair()\` returns a Promise in \`'flair'\` mode because fonts are lazy-loaded on first use. In \`'text'\` mode it is synchronous. See [Why \`await\`?](#why-await) above.

## Available Fonts

All fonts are from the [FIGlet](http://www.figlet.org/) font library via the excellent [figlet.js](https://github.com/patorjk/figlet.js) project by [patorjk](https://github.com/patorjk). FIGlet fonts have been a beloved part of computing culture since 1991 — ascii-flair just makes them easy to drop into any JavaScript project.

Fonts are pre-compiled at build time so figlet is never a runtime dependency. Full credit to the FIGlet authors and contributors for decades of ASCII art.
${fontGallery}

## Credits

- **[figlet.js](https://github.com/patorjk/figlet.js)** by [patorjk](https://github.com/patorjk) — the font engine that makes this possible. Used as a build-time devDependency to pre-compile font data.
- **[FIGlet](http://www.figlet.org/)** — the original FIGlet project (1991) by Glenn Chappell, Ian Chai, and many contributors. The font formats and designs come from this community.
- **Font authors** — each FIGlet font was designed by an individual contributor. Font credits are embedded in the original \`.flf\` font files in the [figlet.js font directory](https://github.com/patorjk/figlet.js/tree/master/fonts).

This project is open source and stands on the shoulders of open source. If you enjoy the fonts, consider starring [figlet.js](https://github.com/patorjk/figlet.js) too.

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
