/**
 * 2-Parameter Assertion Example
 *
 * Compares two values to check if the first is greater than the second.
 * This demonstrates a 2-param assertion pattern (actual vs expected).
 */

export function isGreaterThan(actual: number, expected: number) {
  const isActualNumber = typeof actual === 'number' && !isNaN(actual)
  const isExpectedNumber = typeof expected === 'number' && !isNaN(expected)

  if (!isActualNumber || !isExpectedNumber) {
    $addAssertionResult({
      passed: false,
      leftValue: actual,
      rightValue: expected,
      message: 'Both values must be valid numbers',
    })
    return
  }

  const passed = actual > expected

  $addAssertionResult({
    passed,
    leftValue: actual,
    rightValue: expected,
    message: passed
      ? `${actual} is greater than ${expected}`
      : `${actual} is not greater than ${expected}`,
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

