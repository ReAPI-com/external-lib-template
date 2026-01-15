import { testCase } from '../_support/decorators'

/**
 * API health check test demonstrating $server usage
 */
export const healthCheck = testCase(
  {
    id: 'api-health-check',
    name: 'API Health Check',
    description: 'Checks if the API server is responding',
    tags: ['smoke', 'api', 'health'],
    priority: 1,
    timeout: 10000,
  },
  async () => {
    const baseUrl = $server?.url || $server?.baseUrl
    // Verify $server is injected
    $addAssertionResult({
      passed: typeof $server !== 'undefined' && !!baseUrl,
      leftValue: typeof $server,
      rightValue: 'object',
      message: '$server should be defined with url',
    })

    try {
      // Make a simple GET request to the health endpoint
      const response = await fetch(`${baseUrl}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      // Check response status
      $addAssertionResult({
        passed: response.status === 200,
        leftValue: response.status,
        rightValue: 200,
        message: 'Health endpoint should return 200',
      })

      // Try to parse response
      const data = await response.json()

      $addAssertionResult({
        passed: !!data,
        leftValue: !!data,
        rightValue: true,
        message: 'Health endpoint should return JSON data',
      })
    } catch (error) {
      $addAssertionResult({
        passed: false,
        leftValue: error instanceof Error ? error.message : String(error),
        rightValue: 'successful request',
        message: 'Health check request should not throw error',
      })
    }
  }
)

/**
 * Authenticated API test demonstrating $server and $auth usage
 */
export const authenticatedRequest = testCase(
  {
    id: 'api-authenticated-request',
    name: 'Authenticated API Request',
    description: 'Makes an authenticated request using $auth headers',
    tags: ['api', 'auth'],
    priority: 2,
    timeout: 10000,
  },
  async () => {
    const baseUrl = $server?.url || $server?.baseUrl
    // Verify $auth is injected
    $addAssertionResult({
      passed: typeof $auth !== 'undefined' && !!$auth.headers,
      leftValue: typeof $auth,
      rightValue: 'object',
      message: '$auth should be defined with headers',
    })

    try {
      // Make authenticated request to user profile endpoint
      const response = await fetch(`${baseUrl}/api/user/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...$auth.headers, // Pre-computed auth headers
        },
      })

      // Check if request was successful or got expected auth error
      const isSuccess = response.status === 200
      const isAuthError = response.status === 401 || response.status === 403

      $addAssertionResult({
        passed: isSuccess || isAuthError,
        leftValue: response.status,
        rightValue: '200 or 401/403',
        message: 'Authenticated request should return 200 or auth error',
      })

      if (isSuccess) {
        const data = await response.json()

        $addAssertionResult({
          passed: !!data,
          leftValue: !!data,
          rightValue: true,
          message: 'Successful response should contain data',
        })
      }
    } catch (error) {
      $addAssertionResult({
        passed: false,
        leftValue: error instanceof Error ? error.message : String(error),
        rightValue: 'successful request',
        message: 'Authenticated request should not throw error',
      })
    }
  }
)

/**
 * API test with secrets demonstrating $vars, $server, and $secrets usage
 */
export const loginWithCredentials = testCase(
  {
    id: 'api-login-credentials',
    name: 'Login with Credentials',
    description: 'Tests login endpoint with credentials from $vars and $secrets',
    tags: ['api', 'auth', 'login'],
    priority: 2,
    timeout: 10000,
  },
  async () => {
    const baseUrl = $server?.url || $server?.baseUrl
    // Verify all required globals are present
    $addAssertionResult({
      passed: typeof $server !== 'undefined' && typeof $vars !== 'undefined',
      leftValue: `$server: ${typeof $server}, $vars: ${typeof $vars}`,
      rightValue: 'both defined',
      message: 'Required globals should be defined',
    })

    // Check if credentials are available
    if (
      !$vars.testUserEmail ||
      typeof $secrets === 'undefined' ||
      !$secrets?.testUserPassword
    ) {
      $addAssertionResult({
        passed: false,
        leftValue: 'missing credentials',
        rightValue: 'testUserEmail and testUserPassword',
        message: 'Test credentials should be configured in VarGroup',
      })
      return
    }

    try {
      // Make login request
      const response = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: $vars.testUserEmail,
          password: $secrets.testUserPassword,
        }),
      })

      // Check response status (200 for success, 401 for invalid credentials)
      const isSuccess = response.status === 200
      const isInvalidCreds = response.status === 401

      $addAssertionResult({
        passed: isSuccess || isInvalidCreds,
        leftValue: response.status,
        rightValue: '200 or 401',
        message: 'Login should return 200 (success) or 401 (invalid credentials)',
      })

      if (isSuccess) {
        const data = await response.json()

        // Check for token in response
        $addAssertionResult({
          passed: !!data.token || !!data.accessToken,
          leftValue: !!(data.token || data.accessToken),
          rightValue: true,
          message: 'Successful login should return a token',
        })
      }
    } catch (error) {
      $addAssertionResult({
        passed: false,
        leftValue: error instanceof Error ? error.message : String(error),
        rightValue: 'successful request',
        message: 'Login request should not throw error',
      })
    }
  }
)
