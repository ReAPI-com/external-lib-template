import { z } from 'zod'

/**
 * 2-Parameter Assertion Example with Zod Validation
 *
 * Compares two values to check if the first is greater than the second.
 * Uses Zod to validate both parameters are numbers.
 */

// Define the expected parameter schemas
const actualSchema = z.number({ message: 'Actual value must be a number' })
const expectedSchema = z.number({ message: 'Expected value must be a number' })

export function isGreaterThan(actual: number, expected: number) {
  // Validate first parameter
  const actualResult = actualSchema.safeParse(actual)
  if (!actualResult.success) {
    $addAssertionResult({
      passed: false,
      leftValue: actual,
      rightValue: expected,
      message: `Actual: ${actualResult.error.issues[0].message}`,
    })
    return
  }

  // Validate second parameter
  const expectedResult = expectedSchema.safeParse(expected)
  if (!expectedResult.success) {
    $addAssertionResult({
      passed: false,
      leftValue: actual,
      rightValue: expected,
      message: `Expected: ${expectedResult.error.issues[0].message}`,
    })
    return
  }

  // Now we know both are numbers
  const actualNum = actualResult.data
  const expectedNum = expectedResult.data
  const passed = actualNum > expectedNum

  $addAssertionResult({
    passed,
    leftValue: actual,
    rightValue: expected,
    message: passed
      ? `${actualNum} is greater than ${expectedNum}`
      : `${actualNum} is not greater than ${expectedNum}`,
  })
}

export const isGreaterThanAssertion: AssertionDefinition = {
  id: 'reapi-is-greater-than',
  displayName: 'Is Greater Than',
  description: 'Checks if the actual value is greater than the expected value',
  noOfParams: 2,
  function: isGreaterThan,
  enabled: true,
  tested: true,
}
