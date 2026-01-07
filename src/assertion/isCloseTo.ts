import { z } from 'zod'

/**
 * 3-Parameter Assertion Example with Zod Validation
 *
 * Checks if the actual value is within a delta of the expected value.
 * Uses Zod to validate all three parameters.
 *
 * Example: isCloseTo(10.5, 10, 1) -> passes because 10.5 is within 1 of 10
 */

// Define the expected parameter schemas
const actualSchema = z.number({
  required_error: 'Actual value is required',
  invalid_type_error: 'Actual value must be a number',
})

const expectedSchema = z.number({
  required_error: 'Expected value is required',
  invalid_type_error: 'Expected value must be a number',
})

const deltaSchema = z
  .number({
    required_error: 'Delta is required',
    invalid_type_error: 'Delta must be a number',
  })
  .nonnegative({ message: 'Delta must be a non-negative number' })

export function isCloseTo(actual: number, expected: number, delta: number) {
  // Validate first parameter
  const actualResult = actualSchema.safeParse(actual)
  if (!actualResult.success) {
    $addAssertionResult({
      passed: false,
      leftValue: actual,
      rightValue: expected,
      options: delta,
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
      options: delta,
      message: `Expected: ${expectedResult.error.issues[0].message}`,
    })
    return
  }

  // Validate third parameter (delta)
  const deltaResult = deltaSchema.safeParse(delta)
  if (!deltaResult.success) {
    $addAssertionResult({
      passed: false,
      leftValue: actual,
      rightValue: expected,
      options: delta,
      message: `Delta: ${deltaResult.error.issues[0].message}`,
    })
    return
  }

  // Now we know all parameters are valid
  const actualNum = actualResult.data
  const expectedNum = expectedResult.data
  const deltaNum = deltaResult.data

  const difference = Math.abs(actualNum - expectedNum)
  const passed = difference <= deltaNum

  $addAssertionResult({
    passed,
    leftValue: actual,
    rightValue: expected,
    options: delta,
    message: passed
      ? `${actualNum} is within ${deltaNum} of ${expectedNum} (difference: ${difference})`
      : `${actualNum} is not within ${deltaNum} of ${expectedNum} (difference: ${difference})`,
  })
}

export const isCloseToAssertion: AssertionDefinition = {
  id: 'reapi-is-close-to',
  displayName: 'Is Close To',
  description: 'Checks if the actual value is within a delta of the expected value',
  noOfParams: 3,
  function: isCloseTo,
  enabled: true,
  tested: true,
}
