import { describe, it, expect } from 'vitest'
import { applyAnsiColor, applyBorder, applyPadding, truncateText, formatBrowser } from '../src/styles.js'

describe('applyAnsiColor', () => {
  it('wraps text in cyan ANSI codes', () => {
    const result = applyAnsiColor('hello', 'cyan')
    expect(result).toBe('\x1b[36mhello\x1b[0m')
  })

  it('wraps text in green ANSI codes', () => {
    const result = applyAnsiColor('hello', 'green')
    expect(result).toBe('\x1b[32mhello\x1b[0m')
  })

  it('wraps text in bold ANSI codes', () => {
    const result = applyAnsiColor('hello', null, true)
    expect(result).toBe('\x1b[1mhello\x1b[0m')
  })

  it('returns text unchanged with no color or bold', () => {
    const result = applyAnsiColor('hello')
    expect(result).toBe('hello')
  })
})

describe('applyBorder', () => {
  it('wraps single line in a box border', () => {
    const result = applyBorder('hello')
    const lines = result.split('\n')
    expect(lines[0]).toBe('┌───────┐')
    expect(lines[1]).toBe('│ hello │')
    expect(lines[2]).toBe('└───────┘')
  })

  it('wraps multi-line text in a box border', () => {
    const result = applyBorder('hi\nthere')
    const lines = result.split('\n')
    expect(lines[0]).toBe('┌───────┐')
    expect(lines[1]).toBe('│ hi    │')
    expect(lines[2]).toBe('│ there │')
    expect(lines[3]).toBe('└───────┘')
  })
})

describe('applyPadding', () => {
  it('adds empty lines above and below', () => {
    const result = applyPadding('hello', 1)
    expect(result).toBe('\nhello\n')
  })

  it('adds multiple lines of padding', () => {
    const result = applyPadding('hello', 2)
    expect(result).toBe('\n\nhello\n\n')
  })

  it('returns text unchanged with 0 padding', () => {
    const result = applyPadding('hello', 0)
    expect(result).toBe('hello')
  })
})

describe('truncateText', () => {
  it('truncates a long line and adds ellipsis', () => {
    const { output, truncated } = truncateText('abcdefghij', 6)
    expect(output).toBe('abcde\u2026')
    expect(output.length).toBe(6)
    expect(truncated).toBe(true)
  })

  it('leaves short text unchanged', () => {
    const { output, truncated } = truncateText('hello', 80)
    expect(output).toBe('hello')
    expect(truncated).toBe(false)
  })

  it('truncates each line independently for multi-line text', () => {
    const { output, truncated } = truncateText('abcdefghij\nshort\nabcdefghij', 6)
    const lines = output.split('\n')
    expect(lines[0]).toBe('abcde\u2026')
    expect(lines[1]).toBe('short')
    expect(lines[2]).toBe('abcde\u2026')
    expect(truncated).toBe(true)
  })

  it('returns text unchanged when maxWidth is falsy', () => {
    const { output, truncated } = truncateText('hello', 0)
    expect(output).toBe('hello')
    expect(truncated).toBe(false)
  })
})

describe('formatBrowser', () => {
  it('applies safe color names', () => {
    const { css } = formatBrowser('hello', { color: 'cyan' })
    expect(css).toBe('color: cyan')
  })

  it('ignores unsafe color values to prevent CSS injection', () => {
    const { css } = formatBrowser('hello', { color: 'red; background-image: url(https://evil.com)' })
    expect(css).toBeNull()
  })

  it('ignores unknown color names', () => {
    const { css } = formatBrowser('hello', { color: 'not-a-color' })
    expect(css).toBeNull()
  })
})
