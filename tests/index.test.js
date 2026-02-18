import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { flair } from '../src/index.js'

describe('flair', () => {
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {})
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
})
