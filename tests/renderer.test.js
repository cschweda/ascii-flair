import { describe, it, expect } from 'vitest'
import { renderAscii } from '../src/renderer.js'

// Minimal mock font for testing
const mockFont = {
  name: 'Mock',
  height: 3,
  chars: {
    'H': ['H H', 'HHH', 'H H'],
    'i': [' . ', ' i ', ' i '],
    ' ': ['   ', '   ', '   ']
  }
}

describe('renderAscii', () => {
  it('renders a single character', () => {
    const { output } = renderAscii('H', mockFont)
    expect(output).toBe('H H\nHHH\nH H')
  })

  it('renders multiple characters side by side', () => {
    const { output } = renderAscii('Hi', mockFont)
    expect(output).toBe('H H . \nHHH i \nH H i ')
  })

  it('falls back to space for unknown characters', () => {
    const { output } = renderAscii('H?', mockFont)
    expect(output).toBe('H H   \nHHH   \nH H   ')
  })

  it('truncates to maxWidth by dropping characters that would exceed it', () => {
    // Each char is 3 wide. maxWidth=7 fits 2 chars (6 wide) but not 3 (9 wide)
    const { output, truncated } = renderAscii('HHH', mockFont, 7)
    expect(output).toBe('H HH H\nHHHHHH\nH HH H')
    expect(truncated).toBe(true)
  })

  it('truncates long text to default 80 chars', () => {
    // 'H' is 3 chars wide, so 80/3 = 26 chars max
    const longText = 'H'.repeat(30)
    const { output, truncated } = renderAscii(longText, mockFont)
    const firstLine = output.split('\n')[0]
    expect(firstLine.length).toBeLessThanOrEqual(80)
    expect(truncated).toBe(true)
  })

  it('respects custom maxWidth', () => {
    const { output } = renderAscii('HHHHHH', mockFont, 10)
    const firstLine = output.split('\n')[0]
    expect(firstLine.length).toBeLessThanOrEqual(10)
  })

  it('returns truncated false when text fits', () => {
    const { truncated } = renderAscii('H', mockFont)
    expect(truncated).toBe(false)
  })

  it('returns truncated true when text is dropped', () => {
    const { truncated } = renderAscii('HHH', mockFont, 4)
    expect(truncated).toBe(true)
  })
})
