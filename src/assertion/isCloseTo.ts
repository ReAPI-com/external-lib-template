/**
 * 3-Parameter Assertion Example
 *
 * Checks if the actual value is within a delta of the expected value.
 * This demonstrates a 3-param assertion pattern (actual, expected, option).
 *
 * Example: isCloseTo(10.5, 10, 1) -> passes because 10.5 is within 1 of 10
 */

export function isCloseTo(actual: number, expected: number, delta: number) {
  const isActualNumber = typeof actual === 'number' && !isNaN(actual)
  const isExpectedNumber = typeof expected === 'number' && !isNaN(expected)
  const isDeltaNumber = typeof delta === 'number' && !isNaN(delta) && delta >= 0

  if (!isActualNumber || !isExpectedNumber) {
    $addAssertionResult({
      passed: false,
      leftValue: actual,
      rightValue: expected,
      options: delta,
      message: 'Actual and expected values must be valid numbers',
    })
    return
  }

  if (!isDeltaNumber) {
    $addAssertionResult({
      passed: false,
      leftValue: actual,
      rightValue: expected,
      options: delta,
      message: 'Delta must be a non-negative number',
    })
    return
  }

  const difference = Math.abs(actual - expected)
  const passed = difference <= delta

  $addAssertionResult({
    passed,
    leftValue: actual,
    rightValue: expected,
    options: delta,
    message: passed
      ? `${actual} is within ${delta} of ${expected} (difference: ${difference})`
      : `${actual} is not within ${delta} of ${expected} (difference: ${difference})`,
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

