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

Each \`flair()\` call is its own line. To build multiple lines, use multiple calls:

\`\`\`js
await flair('My App', 'flair', 'doom')
await flair('v2.0', 'flair', 'mini')
flair('Ready to go!', 'text', { color: 'green' })
\`\`\`

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
