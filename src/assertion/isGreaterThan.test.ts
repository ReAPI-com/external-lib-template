import { beforeEach, describe, expect, it } from 'vitest'
import { isGreaterThan } from './isGreaterThan'

describe('isGreaterThan (2-param assertion)', () => {
  // ============================================================================
  // Test Setup
  // ============================================================================
  // This is a 2-parameter assertion: isGreaterThan(actual, expected)
  // It compares two values and reports if actual > expected.
  // ============================================================================

  let assertionResults: {
    passed: boolean
    leftValue?: any
    rightValue?: any
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
    it('should pass when actual > expected (integers)', () => {
      isGreaterThan(10, 5)

      expect(assertionResults).toHaveLength(1)
      expect(assertionResults[0].passed).toBe(true)
      expect(assertionResults[0].leftValue).toBe(10)
      expect(assertionResults[0].rightValue).toBe(5)
    })

    it('should pass when actual > expected (floats)', () => {
      isGreaterThan(3.14, 2.71)

      expect(assertionResults).toHaveLength(1)
      expect(assertionResults[0].passed).toBe(true)
    })

    it('should pass when actual > expected (negative numbers)', () => {
      isGreaterThan(-5, -10)

      expect(assertionResults).toHaveLength(1)
      expect(assertionResults[0].passed).toBe(true)
    })
  })

  describe('failing cases', () => {
    it('should fail when actual < expected', () => {
      isGreaterThan(5, 10)

      expect(assertionResults).toHaveLength(1)
      expect(assertionResults[0].passed).toBe(false)
    })

    it('should fail when actual === expected', () => {
      isGreaterThan(5, 5)

      expect(assertionResults).toHaveLength(1)
      expect(assertionResults[0].passed).toBe(false)
    })

    it('should fail for non-number actual with validation error', () => {
      isGreaterThan('10' as any, 5)

      expect(assertionResults).toHaveLength(1)
      expect(assertionResults[0].passed).toBe(false)
      expect(assertionResults[0].message).toContain('expected number')
    })

    it('should fail for non-number expected with validation error', () => {
      isGreaterThan(10, '5' as any)

      expect(assertionResults).toHaveLength(1)
      expect(assertionResults[0].passed).toBe(false)
      expect(assertionResults[0].message).toContain('expected number')
    })

    it('should fail for NaN actual with validation error', () => {
      isGreaterThan(NaN, 5)

      expect(assertionResults).toHaveLength(1)
      expect(assertionResults[0].passed).toBe(false)
      expect(assertionResults[0].message).toContain('expected number')
    })
  })
})

