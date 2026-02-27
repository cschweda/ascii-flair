# ascii-flair

Minimal ASCII art and styled text for `console.log` — works everywhere.

This doesn't solve a problem. It won't make your app faster or your code cleaner. It's just a bit of whimsical flair for your console — because sometimes the best reason to build something is that it makes you smile.

- **~1-2KB** core (text mode)
- **~1-2KB** per font (lazy-loaded on demand)
- **Zero runtime dependencies** — fonts are pre-compiled
- Works in **browser** and **terminal**
- Framework-agnostic: Vue, React, Angular, Nuxt, Next, plain Node.js

## Install

```bash
npm install ascii-flair
```

## Zero Impact

ascii-flair writes to `console.log` and nothing else. It does not touch the DOM, modify state, inject styles, or affect your application in any way. It's a dev console novelty — your users will never see it, and your app will never feel it.

The entire core is **~1-2KB gzipped**. Each font adds another ~1-2KB, loaded on demand. That's it.

## Dependencies & Size

ascii-flair has **zero runtime dependencies**. None. When you `npm install ascii-flair`, nothing else comes with it.

Fonts are pre-compiled at build time using [figlet](https://www.npmjs.com/package/figlet), which is a **devDependency only** — it never ships to your users. The compiled fonts are compact JSON-like JavaScript modules that get lazy-loaded on demand.

| What | Size (gzipped) |
|------|---------------|
| Core (`flair()` + text mode) | ~1.7 KB |
| One font (e.g. `standard`) | ~1-2 KB |
| Total for a typical call | ~3 KB |

For comparison, that's smaller than most single SVG icons.

**Framework-agnostic by design.** ascii-flair is plain JavaScript with no framework bindings, no peer dependencies, and no special build plugins. It works anywhere JavaScript runs:

- **Vue / Nuxt** — call it in `onMounted`, a plugin, or `main.js`
- **React / Next** — call it in `useEffect`, a layout, or an entry file
- **Angular** — call it in `ngOnInit` or a service
- **Svelte / SvelteKit** — call it in `onMount` or a server hook
- **Plain Node.js / CLI tools** — call it at the top of your script
- **Vanilla browser** — call it in a `<script type="module">`

It uses standard ES module `import` and dynamic `import()` for font loading — both are part of the JavaScript language, not tied to any bundler or framework. Vite, webpack, Rollup, esbuild, Turbopack — they all handle it natively.

## Usage

```js
import { flair } from 'ascii-flair'

// ASCII art mode
await flair('My App', 'flair', 'standard')

// ASCII art with styling
await flair('My App', 'flair', 'doom', { color: 'cyan', border: true })

// Styled plain text
flair('Server started on :3000', 'text', { color: 'green', bold: true })

// Plain text with border
flair('v2.0', 'text', { border: true, padding: 1 })
```

### Why `await`?

In `'flair'` mode, fonts are **lazy-loaded** the first time you use them. This keeps the initial bundle tiny — you only pay for the fonts you actually use. The trade-off is that the first call with a given font returns a Promise.

```js
// flair mode → async (font must be loaded)
await flair('Hello', 'flair', 'doom')

// text mode → synchronous (no font needed)
flair('Hello', 'text')
```

**What if you skip `await`?** It still works. The text will appear in the console. But if you have multiple `flair()` calls, they may print out of order because the font loads haven't resolved yet. Use `await` when ordering matters:

```js
// These will always print in order
await flair('My App', 'flair', 'doom')
await flair('v2.0', 'flair', 'mini')
flair('Ready to go!', 'text', { color: 'green' })
```

After a font loads once, it's cached — subsequent calls with the same font resolve instantly.

### In the Browser (Vue, React, Angular, etc.)

Open your browser's DevTools console. That's where the output goes. Your users never see it. Your app's rendering, state, and performance are completely unaffected.

```js
// React — in a useEffect, component mount, wherever
import { flair } from 'ascii-flair'

useEffect(() => {
  flair('My React App', 'flair', 'doom')
  flair('v3.1.0', 'text', { color: 'cyan' })
}, [])
```

```js
// Vue — in a plugin, onMounted, main.js, wherever
import { flair } from 'ascii-flair'

onMounted(() => {
  flair('My Vue App', 'flair', 'standard')
})
```

```js
// Nuxt — in a plugin
export default defineNuxtPlugin(() => {
  flair('My Nuxt App', 'flair', 'slant')
})
```

In browser contexts, colors render as CSS-styled `console.log` output.

### In the Terminal (Node.js, CLI tools)

```js
// Node.js — at startup, in a CLI, wherever
import { flair } from 'ascii-flair'

await flair('my-cli', 'flair', 'doom', { color: 'cyan' })
flair('v1.0.0 ready', 'text', { color: 'green', bold: true })
```

In terminal contexts, colors render as ANSI escape codes.

### Auto-Truncation

Output is automatically capped at **80 characters wide** by default. In flair mode, characters that would push the ASCII art past the limit are dropped. In text mode, long lines are truncated with an ellipsis (`…`).

You can customize the width with `maxWidth`:

```js
// Narrow output (40 chars)
flair('Hello World', 'flair', 'standard', { maxWidth: 40 })

// Wider output (120 chars)
flair('Hello World', 'flair', 'standard', { maxWidth: 120 })

// Text mode also respects maxWidth
flair('A very long message...', 'text', { maxWidth: 50 })
```

Keep your text short — shorter is better. The auto-truncation is a safety net, not a design tool.

## API

```
flair(text, mode, fontOrOptions?, options?)
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `text` | string | The text to render |
| `mode` | `'flair'` \| `'text'` | ASCII art or styled plain text |
| `fontOrOptions` | string \| object | Font name (flair mode) or options (text mode) |
| `options` | object | Styling options (flair mode) |

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `color` | string | — | Terminal: `red`, `green`, `yellow`, `blue`, `magenta`, `cyan`, `white`. Browser also supports: `orange`, `purple`, `pink`, `gray`, `grey`, `black`. |
| `bold` | boolean | `false` | Bold text (terminal only) |
| `border` | boolean | `false` | Wrap in a box border |
| `padding` | number | `0` | Lines of padding around text |
| `maxWidth` | number | `80` | Max output width in characters. Text beyond this is truncated. |

> **Note:** `flair()` returns a Promise in `'flair'` mode because fonts are lazy-loaded on first use. In `'text'` mode it is synchronous. See [Why `await`?](#why-await) above.

## Available Fonts

All fonts are from the [FIGlet](http://www.figlet.org/) font library via the excellent [figlet.js](https://github.com/patorjk/figlet.js) project by [patorjk](https://github.com/patorjk). FIGlet fonts have been a beloved part of computing culture since 1991 — ascii-flair just makes them easy to drop into any JavaScript project.

Fonts are pre-compiled at build time so figlet is never a runtime dependency. Full credit to the FIGlet authors and contributors for decades of ASCII art.

#### Clean / Classic

**Standard** (`standard`)
```
  _   _      _ _       
 | | | | ___| | | ___  
 | |_| |/ _ \ | |/ _ \ 
 |  _  |  __/ | | (_) |
 |_| |_|\___|_|_|\___/ 
                       
```

**Big** (`big`)
```
  _    _      _ _       
 | |  | |    | | |      
 | |__| | ___| | | ___  
 |  __  |/ _ \ | |/ _ \ 
 | |  | |  __/ | | (_) |
 |_|  |_|\___|_|_|\___/ 
                        
                        
```

**Small** (`small`)
```
  _  _     _ _     
 | || |___| | |___ 
 | __ / -_) | / _ \
 |_||_\___|_|_\___/
                   
```

#### Bold / Impact

**Banner** (`banner`)
```
 #     #                             
 #     # ###### #      #       ####  
 #     # #      #      #      #    # 
 ####### #####  #      #      #    # 
 #     # #      #      #      #    # 
 #     # #      #      #      #    # 
 #     # ###### ###### ######  ####  
                                     
```

**Block** (`block`)
```
                                       
 _|    _|            _|  _|            
 _|    _|    _|_|    _|  _|    _|_|    
 _|_|_|_|  _|_|_|_|  _|  _|  _|    _|  
 _|    _|  _|        _|  _|  _|    _|  
 _|    _|    _|_|_|  _|  _|    _|_|    
                                       
                                       
```

**Doom** (`doom`)
```
 _   _      _ _       
| | | |    | | |      
| |_| | ___| | | ___  
|  _  |/ _ \ | |/ _ \ 
| | | |  __/ | | (_) |
\_| |_/\___|_|_|\___/ 
                      
                      
```

#### Decorative

**Slant** (`slant`)
```
    __  __     ____    
   / / / /__  / / /___ 
  / /_/ / _ \/ / / __ \
 / __  /  __/ / / /_/ /
/_/ /_/\___/_/_/\____/ 
                       
```

**Shadow** (`shadow`)
```
  |   |        |  |        
  |   |   _ \  |  |   _ \  
  ___ |   __/  |  |  (   | 
 _|  _| \___| _| _| \___/  
                           
```

**Isometric1** (`isometric1`)
```
      ___           ___           ___       ___       ___     
     /\__\         /\  \         /\__\     /\__\     /\  \    
    /:/  /        /::\  \       /:/  /    /:/  /    /::\  \   
   /:/__/        /:/\:\  \     /:/  /    /:/  /    /:/\:\  \  
  /::\  \ ___   /::\~\:\  \   /:/  /    /:/  /    /:/  \:\  \ 
 /:/\:\  /\__\ /:/\:\ \:\__\ /:/__/    /:/__/    /:/__/ \:\__\
 \/__\:\/:/  / \:\~\:\ \/__/ \:\  \    \:\  \    \:\  \ /:/  /
      \::/  /   \:\ \:\__\    \:\  \    \:\  \    \:\  /:/  / 
      /:/  /     \:\ \/__/     \:\  \    \:\  \    \:\/:/  /  
     /:/  /       \:\__\        \:\__\    \:\__\    \::/  /   
     \/__/         \/__/         \/__/     \/__/     \/__/    
```

#### Compact

**Mini** (`mini`)
```
                 
 |_|  _  | |  _  
 | | (/_ | | (_) 
                 
```

**Short** (`short`)
```
|_| _ ||  
| |(/_||()
          
```

**Thin** (`thin`)
```
                         
|   |     |    |         
|---|,---.|    |    ,---.
|   ||---'|    |    |   |
`   '`---'`---'`---'`---'
                         
```

#### Fun

**Bubble** (`bubble`)
```
   _   _   _   _   _  
  / \ / \ / \ / \ / \ 
 ( H | e | l | l | o )
  \_/ \_/ \_/ \_/ \_/ 
```

**Digital** (`digital`)
```
 +-+-+-+-+-+
 |H|e|l|l|o|
 +-+-+-+-+-+
```

**Graffiti** (`graffiti`)
```
  ___ ___         .__  .__          
 /   |   \   ____ |  | |  |   ____  
/    ~    \_/ __ \|  | |  |  /  _ \ 
\    Y    /\  ___/|  |_|  |_(  <_> )
 \___|_  /  \___  >____/____/\____/ 
       \/       \/                  
```

#### Monospace

**ANSI Regular** (`ansi-regular`)
```
██   ██ ███████ ██      ██       ██████  
██   ██ ██      ██      ██      ██    ██ 
███████ █████   ██      ██      ██    ██ 
██   ██ ██      ██      ██      ██    ██ 
██   ██ ███████ ███████ ███████  ██████  
                                         
                                         
```

**Cybermedium** (`cybermedium`)
```
_  _ ____ _    _    ____ 
|__| |___ |    |    |  | 
|  | |___ |___ |___ |__| 
                         
```

**Rectangles** (`rectangles`)
```
                   
 _____     _ _     
|  |  |___| | |___ 
|     | -_| | | . |
|__|__|___|_|_|___|
                   
```


## Adding Custom Fonts

ascii-flair ships with 18 curated fonts, but [figlet.js](https://github.com/patorjk/figlet.js) has **326+** fonts available. If you need a font that isn't included, there are two ways to add it depending on your situation. Both are straightforward if you're comfortable with npm.

### Option 1: `registerFont()` — for apps consuming ascii-flair as a dependency

If you're using ascii-flair as an npm dependency in your app (deployed to Netlify, Vercel, Coolify, etc.), you can't modify the package's built-in fonts. Instead, use `registerFont()` to add fonts at runtime.

**Step 1: Generate the font data**

Create a one-time build script in your project (e.g. `scripts/generate-font.js`):

```js
// scripts/generate-font.js
// Run: node scripts/generate-font.js
import figlet from 'figlet'
import { writeFileSync } from 'fs'

const FONT_NAME = 'Ghost'  // ← change this to the figlet font you want
const CHARS = ' !\"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~'

function extractChar(char, fontName) {
  return new Promise((resolve) => {
    figlet.text(char, { font: fontName }, (err, result) => {
      if (err) { resolve(null); return }
      const lines = result.split('\n')
      while (lines.length && lines[lines.length - 1].trim() === '') lines.pop()
      resolve(lines)
    })
  })
}

async function main() {
  const chars = {}
  let height = 0
  for (const char of CHARS) {
    const lines = await extractChar(char, FONT_NAME)
    if (lines) {
      chars[char] = lines
      if (lines.length > height) height = lines.length
    }
  }
  // Pad all chars to the same height
  for (const char of Object.keys(chars)) {
    while (chars[char].length < height) chars[char].push('')
  }
  const fontData = { name: FONT_NAME, height, chars }
  const safeName = FONT_NAME.toLowerCase().replace(/\s+/g, '-')
  writeFileSync(`src/fonts/${safeName}.json`, JSON.stringify(fontData), 'utf8')
  console.log(`Generated src/fonts/${safeName}.json (${Object.keys(chars).length} chars, height ${height})`)
}

main()
```

You'll need figlet as a devDependency: `npm install -D figlet`

**Step 2: Register the font in your app**

```js
import { flair, registerFont } from 'ascii-flair'
import ghostFont from './fonts/ghost.json'

registerFont('ghost', ghostFont)

await flair('Hello', 'flair', 'ghost')
```

The JSON file gets bundled with your app by your framework's bundler (Vite, webpack, etc.) and deployed alongside it. No changes to the ascii-flair package needed.

**`registerFont(name, fontData)` API:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `name` | string | Lowercase font name (letters, numbers, hyphens only) |
| `fontData` | object | `{ name: string, height: number, chars: { [char]: string[] } }` |

Registered fonts are cached in memory and override built-in fonts of the same name.

### Option 2: Fork and extend — for maintainers and contributors

If you maintain your own fork of ascii-flair (or want to contribute a font upstream), you can add fonts directly to the build.

**Step 1:** Preview the font at [patorjk.com/software/taag](http://patorjk.com/software/taag/) to make sure you like it.

**Step 2:** Add the font name to the `FONTS` array in `scripts/compile-fonts.js`:

```js
// scripts/compile-fonts.js — add the exact figlet font name
const FONTS = [
  'Standard',
  // ... existing fonts ...
  'Ghost'       // ← add here (must match figlet exactly, case-sensitive)
]
```

**Step 3:** Compile and verify:

```bash
npm run build:fonts      # compiles the new font to src/fonts/ghost.js
npm test                 # make sure nothing broke
npm run build            # build the dist
```

The compile script validates that the font name exists in figlet's library (326+ fonts) and will give you a clear error if it doesn't. It also warns if the font fails to render many characters.

**Step 4:** Commit and publish:

```bash
git add src/fonts/ghost.js scripts/compile-fonts.js
git commit -m "feat: add Ghost font"
./scripts/publish.sh patch
git push origin main --tags
```

### Browsing available figlet fonts

To see all 326+ fonts available in figlet:

```bash
# List all font names
node -e "import('figlet').then(f => f.default.fonts((e,r) => console.log(r.join('\n'))))"

# Preview a specific font
node -e "import('figlet').then(f => f.default.text('Hello', { font: 'Ghost' }, (e,r) => console.log(r)))"
```

Or browse them visually at [patorjk.com/software/taag](http://patorjk.com/software/taag/).

### Security notes

- **Font names are validated** at runtime. Only lowercase letters, numbers, and hyphens are allowed. This prevents path traversal attacks (e.g. `../../etc/passwd`) through the dynamic `import()` used for built-in font loading.
- **`registerFont()` validates font data structure** before accepting it. Font data must have the correct shape (`name`, `height`, `chars`).
- **Browser CSS colors are allowlisted.** The `color` option only accepts known safe color names to prevent CSS injection through `console.log('%c...')`.
- **All output goes to `console.log` only.** ascii-flair never touches the DOM, never uses `innerHTML`, and never injects scripts. Font data is rendered as plain text strings.

## Credits

- **[figlet.js](https://github.com/patorjk/figlet.js)** by [patorjk](https://github.com/patorjk) — the font engine that makes this possible. Used as a build-time devDependency to pre-compile font data.
- **[FIGlet](http://www.figlet.org/)** — the original FIGlet project (1991) by Glenn Chappell, Ian Chai, and many contributors. The font formats and designs come from this community.
- **Font authors** — each FIGlet font was designed by an individual contributor. Font credits are embedded in the original `.flf` font files in the [figlet.js font directory](https://github.com/patorjk/figlet.js/tree/master/fonts).

This project is open source and stands on the shoulders of open source. If you enjoy the fonts, consider starring [figlet.js](https://github.com/patorjk/figlet.js) too.

## License

MIT
