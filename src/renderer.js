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
