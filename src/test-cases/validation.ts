import { testCase } from '../_support/decorators'

/**
 * Simple validation test demonstrating $vars usage
 */
export const validateEnvironmentVars = testCase(
  {
    id: 'validate-env-vars',
    name: 'Validate Environment Variables',
    description: 'Ensures required environment variables are present',
    tags: ['smoke', 'validation'],
    priority: 1,
    timeout: 5000,
  },
  async () => {
    // Check that $vars is available
    $addAssertionResult({
      passed: typeof $vars !== 'undefined',
      leftValue: typeof $vars,
      rightValue: 'object',
      message: '$vars should be defined',
    })

    // Check for common variables
    const hasBaseUrl = typeof $vars !== 'undefined' && !!$vars.baseUrl
    $addAssertionResult({
      passed: hasBaseUrl,
      leftValue: hasBaseUrl,
      rightValue: true,
      message: '$vars.baseUrl should be defined',
    })
  }
)

/**
 * Test demonstrating basic data validation with $vars
 */
export const validateUserData = testCase(
  {
    id: 'validate-user-data',
    name: 'Validate User Data',
    description: 'Validates user data from environment variables',
    tags: ['validation', 'user'],
    priority: 2,
    timeout: 5000,
  },
  async () => {
    // Validate user email format if present
    if (typeof $vars !== 'undefined' && $vars.testUserEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      const isValidEmail = emailRegex.test($vars.testUserEmail)

      $addAssertionResult({
        passed: isValidEmail,
        leftValue: $vars.testUserEmail,
        rightValue: 'valid email format',
        message: 'testUserEmail should be a valid email',
      })
    }

    // Validate user ID if present
    if (typeof $vars !== 'undefined' && 'testUserId' in $vars) {
      const isValidId = typeof $vars.testUserId === 'string' && $vars.testUserId.length > 0

      $addAssertionResult({
        passed: isValidId,
        leftValue: $vars.testUserId,
        rightValue: 'non-empty string',
        message: 'testUserId should be a non-empty string',
      })
    }
  }
)
