import { beforeEach, describe, expect, it } from 'vitest'
import { isGeoLocation } from './isGeoLocation'

describe('isGeoLocation', () => {
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

  describe('valid geo locations - object format', () => {
    it('should pass for valid {lat, lng} object', () => {
      isGeoLocation({ lat: 40.7128, lng: -74.006 })

      expect(assertionResults).toHaveLength(1)
      expect(assertionResults[0].passed).toBe(true)
    })

    it('should pass for coordinates at origin', () => {
      isGeoLocation({ lat: 0, lng: 0 })

      expect(assertionResults).toHaveLength(1)
      expect(assertionResults[0].passed).toBe(true)
    })

    it('should pass for extreme valid coordinates', () => {
      isGeoLocation({ lat: 90, lng: 180 })

      expect(assertionResults).toHaveLength(1)
      expect(assertionResults[0].passed).toBe(true)
    })

    it('should pass for negative extreme coordinates', () => {
      isGeoLocation({ lat: -90, lng: -180 })

      expect(assertionResults).toHaveLength(1)
      expect(assertionResults[0].passed).toBe(true)
    })
  })

  describe('valid geo locations - array format', () => {
    it('should pass for valid [lat, lng] array', () => {
      isGeoLocation([40.7128, -74.006])

      expect(assertionResults).toHaveLength(1)
      expect(assertionResults[0].passed).toBe(true)
    })
  })

  describe('invalid geo locations', () => {
    it('should fail for object missing lng', () => {
      isGeoLocation({ lat: 1 })

      expect(assertionResults).toHaveLength(1)
      expect(assertionResults[0].passed).toBe(false)
    })

    it('should fail for object missing lat', () => {
      isGeoLocation({ lng: 1 })

      expect(assertionResults).toHaveLength(1)
      expect(assertionResults[0].passed).toBe(false)
    })

    it('should fail for latitude out of range (> 90)', () => {
      isGeoLocation({ lat: 91, lng: 0 })

      expect(assertionResults).toHaveLength(1)
      expect(assertionResults[0].passed).toBe(false)
    })

    it('should fail for latitude out of range (< -90)', () => {
      isGeoLocation({ lat: -91, lng: 0 })

      expect(assertionResults).toHaveLength(1)
      expect(assertionResults[0].passed).toBe(false)
    })

    it('should fail for longitude out of range (> 180)', () => {
      isGeoLocation({ lat: 0, lng: 181 })

      expect(assertionResults).toHaveLength(1)
      expect(assertionResults[0].passed).toBe(false)
    })

    it('should fail for longitude out of range (< -180)', () => {
      isGeoLocation({ lat: 0, lng: -181 })

      expect(assertionResults).toHaveLength(1)
      expect(assertionResults[0].passed).toBe(false)
    })

    it('should fail for null', () => {
      isGeoLocation(null)

      expect(assertionResults).toHaveLength(1)
      expect(assertionResults[0].passed).toBe(false)
    })

    it('should fail for undefined', () => {
      isGeoLocation(undefined)

      expect(assertionResults).toHaveLength(1)
      expect(assertionResults[0].passed).toBe(false)
    })

    it('should fail for string', () => {
      isGeoLocation('40.7128,-74.0060')

      expect(assertionResults).toHaveLength(1)
      expect(assertionResults[0].passed).toBe(false)
    })

    it('should fail for array with wrong length', () => {
      isGeoLocation([40.7128])

      expect(assertionResults).toHaveLength(1)
      expect(assertionResults[0].passed).toBe(false)
    })
  })
})
