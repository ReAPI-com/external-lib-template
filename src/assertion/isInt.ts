import { z } from 'zod'

/**
 * 1-Parameter Assertion Example with Zod Validation
 *
 * Validates that a value is an integer.
 * Uses Zod to validate the parameter type.
 */

// Define the expected parameter schema
const paramSchema = z.number({ message: 'Value must be a number' })

export function isInt(value: number) {
  // Validate parameter type using Zod
  const parseResult = paramSchema.safeParse(value)

  if (!parseResult.success) {
    $addAssertionResult({
      passed: false,
      leftValue: value,
      message: parseResult.error.issues[0].message,
    })
    return
  }

  // Now we know value is a number
  const num = parseResult.data
  const passed = Number.isInteger(num)

  $addAssertionResult({
    passed,
    leftValue: value,
    message: passed ? 'The value is an integer' : 'The value is not an integer',
  })
}

export const isIntAssertion: AssertionDefinition = {
  id: 'reapi-is-int',
  displayName: 'Is Integer',
  description: 'Validates that the value is an integer',
  noOfParams: 1,
  function: isInt,
  enabled: true,
  tested: true,
}
