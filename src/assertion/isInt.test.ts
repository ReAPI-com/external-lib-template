import { beforeEach, describe, expect, it } from 'vitest'
import { isInt } from './isInt'

describe('isInt', () => {
  // ============================================================================
  // Test Setup
  // ============================================================================
  // Mock the platform-injected $addAssertionResult function.
  // In ReAPI runtime, this function is provided by the platform to collect
  // assertion results. For testing, we capture results in an array.
  // ============================================================================

  let assertionResults: { passed: boolean; leftValue?: any; message?: string }[] = []

  beforeEach(() => {
    assertionResults = []
    // @ts-ignore - globalThis typing
    globalThis.$addAssertionResult = (result: { passed: boolean; leftValue?: any; message?: string }) => {
      assertionResults.push(result)
    }
  })

  // ============================================================================
  // Test Cases
  // ============================================================================

  describe('valid integers', () => {
    it('should pass for positive integer', () => {
      isInt(42)

      expect(assertionResults).toHaveLength(1)
      expect(assertionResults[0].passed).toBe(true)
      expect(assertionResults[0].leftValue).toBe(42)
    })

    it('should pass for zero', () => {
      isInt(0)

      expect(assertionResults).toHaveLength(1)
      expect(assertionResults[0].passed).toBe(true)
    })

    it('should pass for negative integer', () => {
      isInt(-10)

      expect(assertionResults).toHaveLength(1)
      expect(assertionResults[0].passed).toBe(true)
    })
  })

  describe('invalid values', () => {
    it('should fail for float', () => {
      isInt(3.14)

      expect(assertionResults).toHaveLength(1)
      expect(assertionResults[0].passed).toBe(false)
      expect(assertionResults[0].leftValue).toBe(3.14)
    })

    it('should fail for string', () => {
      isInt('42')

      expect(assertionResults).toHaveLength(1)
      expect(assertionResults[0].passed).toBe(false)
    })

    it('should fail for null', () => {
      isInt(null)

      expect(assertionResults).toHaveLength(1)
      expect(assertionResults[0].passed).toBe(false)
    })

    it('should fail for undefined', () => {
      isInt(undefined)

      expect(assertionResults).toHaveLength(1)
      expect(assertionResults[0].passed).toBe(false)
    })

    it('should fail for object', () => {
      isInt({ value: 42 })

      expect(assertionResults).toHaveLength(1)
      expect(assertionResults[0].passed).toBe(false)
    })

    it('should fail for NaN', () => {
      isInt(NaN)

      expect(assertionResults).toHaveLength(1)
      expect(assertionResults[0].passed).toBe(false)
    })
  })
})
