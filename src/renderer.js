// src/renderer.js

const DEFAULT_MAX_WIDTH = 80

export function renderAscii(text, fontData, maxWidth = DEFAULT_MAX_WIDTH) {
  const { height, chars } = fontData
  const fallback = chars[' '] || Array(height).fill('')

  const lines = Array.from({ length: height }, () => '')

  for (const char of text) {
    const charLines = chars[char] || fallback
    const charWidth = charLines[0]?.length || 0

    // Stop adding characters if the next one would exceed maxWidth
    if (lines[0].length + charWidth > maxWidth) break

    for (let row = 0; row < height; row++) {
      lines[row] += charLines[row] || ''
    }
  }

  return lines.join('\n')
}
