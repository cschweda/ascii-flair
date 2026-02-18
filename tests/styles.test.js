import { describe, it, expect } from 'vitest'
import { applyAnsiColor, applyBorder, applyPadding } from '../src/styles.js'

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
