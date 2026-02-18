import { describe, it, expect } from 'vitest'
import { isBrowser } from '../src/detect.js'

describe('detect', () => {
  it('returns false in Node.js environment', () => {
    expect(isBrowser()).toBe(false)
  })
})
