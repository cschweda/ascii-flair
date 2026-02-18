import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { flair, registerFont } from '../src/index.js'

describe('flair', () => {
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {})
    vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('logs styled plain text in text mode', () => {
    flair('hello', 'text')
    expect(console.log).toHaveBeenCalledWith('hello')
  })

  it('logs plain text with border', () => {
    flair('hello', 'text', { border: true })
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('\u250c')
    )
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('hello')
    )
  })

  it('logs plain text with ANSI color in terminal', () => {
    flair('hello', 'text', { color: 'cyan' })
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('\x1b[36m')
    )
  })

  it('logs ASCII art in flair mode', async () => {
    await flair('Hi', 'flair', 'standard')
    expect(console.log).toHaveBeenCalled()
    const output = console.log.mock.calls[0][0]
    expect(output.split('\n').length).toBeGreaterThan(1)
  })

  it('throws on unknown mode', async () => {
    await expect(flair('hello', 'invalid')).rejects.toThrow()
  })

  it('rejects font names with path traversal', async () => {
    await expect(flair('hi', 'flair', '../../etc/passwd')).rejects.toThrow('invalid font name')
  })

  it('rejects font names with special characters', async () => {
    await expect(flair('hi', 'flair', '../index')).rejects.toThrow('invalid font name')
  })

  it('rejects font names starting with a hyphen', async () => {
    await expect(flair('hi', 'flair', '-bad')).rejects.toThrow('invalid font name')
  })

  it('truncates ASCII art to 80 chars wide by default', async () => {
    await flair('This Is A Really Long String Of Text', 'flair', 'standard')
    expect(console.log).toHaveBeenCalled()
    const output = console.log.mock.calls[0][0]
    const lines = output.split('\n')
    for (const line of lines) {
      expect(line.length).toBeLessThanOrEqual(80)
    }
  })

  it('respects custom maxWidth in flair mode', async () => {
    await flair('Hello World', 'flair', 'standard', { maxWidth: 40 })
    expect(console.log).toHaveBeenCalled()
    const output = console.log.mock.calls[0][0]
    const lines = output.split('\n')
    for (const line of lines) {
      expect(line.length).toBeLessThanOrEqual(40)
    }
  })

  it('truncates plain text to maxWidth', () => {
    const longText = 'a'.repeat(100)
    flair(longText, 'text')
    const output = console.log.mock.calls[0][0]
    expect(output.length).toBeLessThanOrEqual(80)
  })

  it('warns when text mode truncates', () => {
    const longText = 'a'.repeat(100)
    flair(longText, 'text')
    expect(console.warn).toHaveBeenCalledWith(
      expect.stringContaining('truncated')
    )
  })

  it('warns when flair mode truncates', async () => {
    await flair('This Is A Really Long String Of Text', 'flair', 'standard')
    expect(console.warn).toHaveBeenCalledWith(
      expect.stringContaining('truncated')
    )
  })

  it('does not warn when text fits in text mode', () => {
    flair('hello', 'text')
    expect(console.warn).not.toHaveBeenCalled()
  })

  it('does not warn when text fits in flair mode', async () => {
    await flair('Hi', 'flair', 'standard')
    expect(console.warn).not.toHaveBeenCalled()
  })
})

describe('registerFont', () => {
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {})
    vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  const customFont = {
    name: 'Custom',
    height: 1,
    chars: { 'H': ['H'], 'i': ['i'], ' ': [' '] }
  }

  it('registers and uses a custom font', async () => {
    registerFont('custom', customFont)
    await flair('Hi', 'flair', 'custom')
    expect(console.log).toHaveBeenCalledWith('Hi')
  })

  it('throws on invalid font name', () => {
    expect(() => registerFont('../../bad', customFont)).toThrow('invalid font name')
  })

  it('throws on missing fontData', () => {
    expect(() => registerFont('test', null)).toThrow('requires fontData')
  })

  it('throws on fontData without height', () => {
    expect(() => registerFont('test', { chars: {} })).toThrow('requires fontData')
  })
})
