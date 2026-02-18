// src/index.js
import { isBrowser } from './detect.js'
import { formatBrowser, formatTerminal, truncateText } from './styles.js'
import { renderAscii } from './renderer.js'

// Font name validation: only allow lowercase alphanumeric, hyphens, and digits.
// Prevents path traversal (e.g. "../../etc/passwd") and injection attacks.
const SAFE_FONT_NAME = /^[a-z0-9][a-z0-9-]*$/

// Cache loaded fonts (also stores user-registered fonts)
const fontCache = new Map()

/**
 * Register a custom font for use with flair().
 * Font data must have: { name: string, height: number, chars: { [char]: string[] } }
 */
export function registerFont(name, fontData) {
  if (!name || typeof name !== 'string') {
    throw new Error('ascii-flair: registerFont requires a font name string.')
  }
  if (!SAFE_FONT_NAME.test(name)) {
    throw new Error(`ascii-flair: invalid font name "${name}". Use only lowercase letters, numbers, and hyphens.`)
  }
  if (!fontData || typeof fontData !== 'object' || typeof fontData.height !== 'number' || !fontData.chars || typeof fontData.chars !== 'object') {
    throw new Error(`ascii-flair: registerFont requires fontData with { name, height, chars }. See README for details.`)
  }
  fontCache.set(name, fontData)
}

async function loadFont(name) {
  if (!SAFE_FONT_NAME.test(name)) {
    throw new Error(`ascii-flair: invalid font name "${name}". Font names may only contain lowercase letters, numbers, and hyphens.`)
  }

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
    const { output, truncated } = truncateText(text, maxWidth)
    outputText(output, opts)
    if (truncated) {
      console.warn(`[ascii-flair] Text was truncated to fit within ${maxWidth} characters.`)
    }
    return
  }

  if (mode === 'flair') {
    const fontName = (typeof fontOrOptions === 'string') ? fontOrOptions : 'standard'
    const opts = options || {}
    const maxWidth = opts.maxWidth || DEFAULT_MAX_WIDTH
    const fontData = await loadFont(fontName)
    const { output, truncated } = renderAscii(text, fontData, maxWidth)
    outputText(output, opts)
    if (truncated) {
      console.warn(`[ascii-flair] Text was truncated to fit within ${maxWidth} characters. Try shorter text or increase maxWidth.`)
    }
    return
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
