import { describe, expect, it } from 'vitest'
import { dateTimeFromTimestamp, formatTimestamp } from './dateTime'

describe('dateTime transformers', () => {
  // ============================================================================
  // Test Setup
  // ============================================================================
  // Value transformers take input and return transformed output.
  // These have noOfParams: 1, meaning they accept a single parameter.
  // Test by passing various inputs and verifying the output.
  // ============================================================================

  describe('dateTimeFromTimestamp', () => {
    it('should convert timestamp to ISO string', () => {
      // 2024-01-15T12:30:00.000Z
      const timestamp = 1705321800000
      const result = dateTimeFromTimestamp(timestamp)

      expect(typeof result).toBe('string')
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
    })

    it('should handle epoch timestamp (0)', () => {
      const result = dateTimeFromTimestamp(0)

      expect(result).toBe('1970-01-01T00:00:00.000Z')
    })

    it('should return parseable date string', () => {
      const timestamp = Date.now()
      const result = dateTimeFromTimestamp(timestamp)
      const parsed = new Date(result)

      expect(parsed.getTime()).toBe(timestamp)
    })
  })

  describe('formatTimestamp', () => {
    it('should format timestamp to readable string', () => {
      // Use a fixed timestamp for predictable output
      const timestamp = 1705321800000 // 2024-01-15 12:30:00 UTC
      const result = formatTimestamp(timestamp)

      expect(typeof result).toBe('string')
      // Format: YYYY-MM-DD HH:mm:ss
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)
    })

    it('should handle epoch timestamp', () => {
      const result = formatTimestamp(0)

      // Will be formatted in local timezone, but should match pattern
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)
    })

    it('should format current timestamp', () => {
      const timestamp = Date.now()
      const result = formatTimestamp(timestamp)

      expect(result).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)
    })
  })
})

