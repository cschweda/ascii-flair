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

## Usage

```js
import { flair } from 'ascii-flair'

// ASCII art mode
flair('My App', 'flair', 'standard')

// ASCII art with styling
flair('My App', 'flair', 'doom', { color: 'cyan', border: true })

// Styled plain text
flair('Server started on :3000', 'text', { color: 'green', bold: true })

// Plain text with border
flair('v2.0', 'text', { border: true, padding: 1 })
```

Each `flair()` call is its own line. To build multiple lines, use multiple calls:

```js
await flair('My App', 'flair', 'doom')
await flair('v2.0', 'flair', 'mini')
flair('Ready to go!', 'text', { color: 'green' })
```

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
| `color` | string | — | `cyan`, `green`, `red`, `yellow`, `blue`, `magenta`, `white` |
| `bold` | boolean | `false` | Bold text (terminal only) |
| `border` | boolean | `false` | Wrap in a box border |
| `padding` | number | `0` | Lines of padding around text |
| `maxWidth` | number | `80` | Max output width in characters. Text beyond this is truncated. |

> **Note:** `flair()` returns a Promise in `'flair'` mode (fonts are lazy-loaded). In `'text'` mode it is synchronous.

## Available Fonts

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


## License

MIT
