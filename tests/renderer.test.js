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
    const result = renderAscii('H', mockFont)
    expect(result).toBe('H H\nHHH\nH H')
  })

  it('renders multiple characters side by side', () => {
    const result = renderAscii('Hi', mockFont)
    expect(result).toBe('H H . \nHHH i \nH H i ')
  })

  it('falls back to space for unknown characters', () => {
    const result = renderAscii('H?', mockFont)
    expect(result).toBe('H H   \nHHH   \nH H   ')
  })

  it('truncates to maxWidth by dropping characters that would exceed it', () => {
    // Each char is 3 wide. maxWidth=7 fits 2 chars (6 wide) but not 3 (9 wide)
    const result = renderAscii('HHH', mockFont, 7)
    expect(result).toBe('H HH H\nHHHHHH\nH HH H')
  })

  it('truncates long text to default 80 chars', () => {
    // 'H' is 3 chars wide, so 80/3 = 26 chars max
    const longText = 'H'.repeat(30)
    const result = renderAscii(longText, mockFont)
    const firstLine = result.split('\n')[0]
    expect(firstLine.length).toBeLessThanOrEqual(80)
  })

  it('respects custom maxWidth', () => {
    const result = renderAscii('HHHHHH', mockFont, 10)
    const firstLine = result.split('\n')[0]
    expect(firstLine.length).toBeLessThanOrEqual(10)
  })
})
