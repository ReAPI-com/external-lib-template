import { describe, expect, it } from 'vitest'
import { now, nowTimestamp } from './dateTime'

describe('dateTime generators', () => {
  // ============================================================================
  // Test Setup
  // ============================================================================
  // Value generators simply return a value - no platform globals needed.
  // Test by calling the function and verifying the output format/type.
  // ============================================================================

  describe('now', () => {
    it('should return current date in ISO format', () => {
      const result = now()

      // Should be a valid ISO string
      expect(typeof result).toBe('string')
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
    })

    it('should return a parseable date', () => {
      const result = now()
      const parsed = new Date(result)

      expect(parsed.getTime()).not.toBeNaN()
    })

    it('should return approximately current time', () => {
      const before = Date.now()
      const result = now()
      const after = Date.now()

      const resultTime = new Date(result).getTime()
      expect(resultTime).toBeGreaterThanOrEqual(before)
      expect(resultTime).toBeLessThanOrEqual(after)
    })
  })

  describe('nowTimestamp', () => {
    it('should return current timestamp as number', () => {
      const result = nowTimestamp()

      expect(typeof result).toBe('number')
      expect(Number.isInteger(result)).toBe(true)
    })

    it('should return approximately current time', () => {
      const before = Date.now()
      const result = nowTimestamp()
      const after = Date.now()

      expect(result).toBeGreaterThanOrEqual(before)
      expect(result).toBeLessThanOrEqual(after)
    })

    it('should return milliseconds since epoch', () => {
      const result = nowTimestamp()

      // Should be a reasonable timestamp (after year 2020)
      expect(result).toBeGreaterThan(1577836800000) // 2020-01-01
    })
  })
})

