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
  const top = `\u250c${'\u2500'.repeat(maxLen + 2)}\u2510`
  const bottom = `\u2514${'\u2500'.repeat(maxLen + 2)}\u2518`
  const bordered = lines.map(l => `\u2502 ${l.padEnd(maxLen)} \u2502`)
  return [top, ...bordered, bottom].join('\n')
}

export function applyPadding(text, padding) {
  if (!padding) return text
  const pad = '\n'.repeat(padding)
  return `${pad}${text}${pad}`
}

export function truncateText(text, maxWidth) {
  if (!maxWidth) return { output: text, truncated: false }
  let didTruncate = false
  const lines = text.split('\n')
  const truncated = lines.map(line => {
    if (line.length > maxWidth) {
      didTruncate = true
      return line.slice(0, maxWidth - 1) + '\u2026'
    }
    return line
  })
  return { output: truncated.join('\n'), truncated: didTruncate }
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
