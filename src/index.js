// src/index.js
import { isBrowser } from './detect.js'
import { formatBrowser, formatTerminal, truncateText } from './styles.js'
import { renderAscii } from './renderer.js'

// Cache loaded fonts
const fontCache = new Map()

async function loadFont(name) {
  if (fontCache.has(name)) return fontCache.get(name)

  try {
    const mod = await import(`./fonts/${name}.js`)
    const fontData = mod.default
    fontCache.set(name, fontData)
    return fontData
  } catch {
    throw new Error(`ascii-flair: unknown font "${name}". Check available fonts in the README.`)
  }
}

const DEFAULT_MAX_WIDTH = 80

export async function flair(text, mode, fontOrOptions, options) {
  if (mode === 'text') {
    const opts = (typeof fontOrOptions === 'object') ? fontOrOptions : (options || {})
    const maxWidth = opts.maxWidth || DEFAULT_MAX_WIDTH
    const truncated = truncateText(text, maxWidth)
    return outputText(truncated, opts)
  }

  if (mode === 'flair') {
    const fontName = (typeof fontOrOptions === 'string') ? fontOrOptions : 'standard'
    const opts = options || {}
    const maxWidth = opts.maxWidth || DEFAULT_MAX_WIDTH
    const fontData = await loadFont(fontName)
    const rendered = renderAscii(text, fontData, maxWidth)
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
