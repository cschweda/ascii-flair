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
})
