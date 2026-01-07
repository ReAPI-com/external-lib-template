import { beforeEach, describe, expect, it } from 'vitest'
import { isCloseTo } from './isCloseTo'

describe('isCloseTo (3-param assertion)', () => {
  // ============================================================================
  // Test Setup
  // ============================================================================
  // This is a 3-parameter assertion: isCloseTo(actual, expected, delta)
  // It checks if |actual - expected| <= delta.
  // ============================================================================

  let assertionResults: {
    passed: boolean
    leftValue?: any
    rightValue?: any
    options?: any
    message?: string
  }[] = []

  beforeEach(() => {
    assertionResults = []
    // @ts-ignore
    globalThis.$addAssertionResult = (result: any) => {
      assertionResults.push(result)
    }
  })

  // ============================================================================
  // Test Cases
  // ============================================================================

  describe('passing cases', () => {
    it('should pass when difference equals delta', () => {
      isCloseTo(10, 9, 1)

      expect(assertionResults).toHaveLength(1)
      expect(assertionResults[0].passed).toBe(true)
      expect(assertionResults[0].leftValue).toBe(10)
      expect(assertionResults[0].rightValue).toBe(9)
      expect(assertionResults[0].options).toBe(1)
    })

    it('should pass when difference is less than delta', () => {
      isCloseTo(10.5, 10, 1)

      expect(assertionResults).toHaveLength(1)
      expect(assertionResults[0].passed).toBe(true)
    })

    it('should pass when values are equal (delta = 0)', () => {
      isCloseTo(5, 5, 0)

      expect(assertionResults).toHaveLength(1)
      expect(assertionResults[0].passed).toBe(true)
    })

    it('should pass for floating point comparison', () => {
      isCloseTo(0.1 + 0.2, 0.3, 0.0001)

      expect(assertionResults).toHaveLength(1)
      expect(assertionResults[0].passed).toBe(true)
    })

    it('should pass when actual < expected within delta', () => {
      isCloseTo(9, 10, 2)

      expect(assertionResults).toHaveLength(1)
      expect(assertionResults[0].passed).toBe(true)
    })
  })

  describe('failing cases', () => {
    it('should fail when difference exceeds delta', () => {
      isCloseTo(10, 5, 2)

      expect(assertionResults).toHaveLength(1)
      expect(assertionResults[0].passed).toBe(false)
      expect(assertionResults[0].message).toContain('not within')
    })

    it('should fail when delta is too small', () => {
      isCloseTo(10.5, 10, 0.1)

      expect(assertionResults).toHaveLength(1)
      expect(assertionResults[0].passed).toBe(false)
    })
  })

  describe('invalid inputs (Zod validation)', () => {
    it('should fail for non-number actual with validation error', () => {
      isCloseTo('10' as any, 10, 1)

      expect(assertionResults).toHaveLength(1)
      expect(assertionResults[0].passed).toBe(false)
      expect(assertionResults[0].message).toContain('must be a number')
    })

    it('should fail for non-number expected with validation error', () => {
      isCloseTo(10, '10' as any, 1)

      expect(assertionResults).toHaveLength(1)
      expect(assertionResults[0].passed).toBe(false)
      expect(assertionResults[0].message).toContain('must be a number')
    })

    it('should fail for negative delta with validation error', () => {
      isCloseTo(10, 10, -1)

      expect(assertionResults).toHaveLength(1)
      expect(assertionResults[0].passed).toBe(false)
      expect(assertionResults[0].message).toContain('non-negative')
    })

    it('should fail for NaN delta with validation error', () => {
      isCloseTo(10, 10, NaN)

      expect(assertionResults).toHaveLength(1)
      expect(assertionResults[0].passed).toBe(false)
      expect(assertionResults[0].message).toContain('must be a number')
    })

    it('should fail for null actual', () => {
      isCloseTo(null, 10, 1)

      expect(assertionResults).toHaveLength(1)
      expect(assertionResults[0].passed).toBe(false)
    })

    it('should fail for undefined delta', () => {
      isCloseTo(10, 10, undefined)

      expect(assertionResults).toHaveLength(1)
      expect(assertionResults[0].passed).toBe(false)
    })
  })
})

