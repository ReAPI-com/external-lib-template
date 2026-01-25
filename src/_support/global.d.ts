interface AssertionResult {
  /**
   * Indicates whether the assertion passed or failed.
   */
  passed: boolean
  /**
   * The actual value obtained during the test.
   */
  leftValue?: any
  /**
   * The expected value to compare against the actual value.
   */
  rightValue?: any
  /**
   * Additional options for the assertion.
   */
  options?: any
  /**
   * A message describing the outcome of the assertion.
   */
  message?: string
  /**
   * Optional metadata related to the assertion.
   */
  meta?: any
}

declare global {
  // ============================================================================
  // RESERVED: Component Definition Interfaces
  // These interfaces define the structure of components that ReAPI can discover
  // and execute. The field names are fixed and must not be changed.
  // ============================================================================

  /**
   * Definition for a custom assertion function.
   * Assertions validate response data and report pass/fail results.
   */
  interface AssertionDefinition {
    /** Unique identifier for this assertion (used by ReAPI to invoke it) */
    id: string
    deprecated?: boolean
    tested: boolean
    enabled: boolean
    /**
     * Number of parameters the assertion accepts:
     * - 1: value only, e.g. isTrue(value)
     * - 2: value + expected, e.g. isEqual(actual, expected)
     * - 3: value + expected + option, e.g. isCloseTo(actual, expected, delta)
     */
    noOfParams: 1 | 2 | 3
    /** The assertion function implementation */
    function: Function
    displayName?: string
    description?: string
  }

  /**
   * Definition for a custom value generator/transformer.
   * Value generators produce dynamic values for test data.
   */
  interface ValueGeneratorDefinition {
    /** Unique identifier for this generator (used by ReAPI to invoke it) */
    id: string
    deprecated?: boolean
    tested: boolean
    enabled: boolean
    /** The generator function implementation */
    function: Function
    /** Number of parameters: 0 (no params) or 1 (with options object) */
    noOfParams: 0 | 1
    displayName?: string
    description?: string
  }

  /**
   * Definition for a custom API hook.
   * Hooks run before requests or after responses to modify data.
   */
  interface HookDefinition {
    /** Unique identifier for this hook (used by ReAPI to invoke it) */
    id: string
    deprecated?: boolean
    tested: boolean
    enabled: boolean
    displayName: string
    description?: string
    /** When the hook runs: before sending request or after receiving response */
    type: 'BEFORE_REQUEST' | 'AFTER_RESPONSE'
    /** The hook function implementation */
    function: Function
  }

  /**
   * Definition for a utility class.
   * Utilities provide helper methods that can be used in scripts.
   */
  interface UtilityDefinition {
    /** Unique identifier for this utility (typically the class name) */
    id: string
    /** Display name shown in the UI */
    displayName?: string
    /** Description of the utility */
    description?: string
    /** The class name */
    className: string
    /** List of static method names available on this utility */
    methods: string[]
  }

  interface ApiRequest {
    method: string
    url: string
    query: Record<string, any>
    headers: Record<string, any>
    body: any
  }

  interface ApiResponse {
    status: number
    statusText: string
    headers: Record<string, any>
    data?: Record<string, any> | null | undefined
  }

  type Json = Record<string, any>

  // Platform-injected globals (keep $ prefix)
  const $request: ApiRequest
  const $response: ApiResponse
  const $context: Record<string, any>

  function $addAssertionResult(result: AssertionResult): void
  function $setGeneratedValue(value: any): void

  // ============================================================================
  // EXTERNAL TEST CASE RUNTIME GLOBALS
  // These globals are injected by ReAPI when executing external test cases
  // ============================================================================

  /**
   * Variables from VarGroup (merged with inheritance chain)
   * Access: $vars.baseUrl, $vars.userId, etc.
   */
  const $vars: Record<string, any>

  /**
   * Secrets from VarGroup (decrypted at runtime)
   * Access: $secrets.API_KEY, $secrets.dbPassword, etc.
   * Security: Never logged, never in code, injected at runtime
   */
  const $secrets: Record<string, any>

  /**
   * Resolved server configuration
   * Derived from selected Server config
   */
  interface ExternalTestCaseServer {
    id: string
    name: string
    /**
     * Canonical server URL (aligned with foundation `RequestServer.url`)
     */
    url: string
    /**
     * @deprecated Use `url` instead. Kept for backward-compatibility with early template examples.
     * In runtime, `baseUrl` mirrors `url`.
     */
    baseUrl: string
  }

  const $server: ExternalTestCaseServer

  // ============================================================================
  // AUTH TYPES (aligned with foundation union types)
  // ============================================================================

  type HttpParamPosition = 'path' | 'query' | 'header' | 'cookie'

  type HttpAuthType = 'basic' | 'bearer' | 'apiKey'

  interface BasicAuth {
    type: 'basic'
    username: string
    password: string
  }

  interface BearerAuth {
    type: 'bearer'
    token: string
  }

  interface ApiKeyAuth {
    type: 'apiKey'
    in: HttpParamPosition
    key: string
    token: string
  }

  type HttpAuthObject = BasicAuth | BearerAuth | ApiKeyAuth

  /**
   * External test cases receive a union-typed auth object plus pre-computed headers.
   * `auth` is aligned with foundation's `HttpAuthObject` union.
   * If no auth is selected, `auth` is null.
   */
  type ExternalTestCaseAuth =
    | { auth: null; headers: Record<string, string> }
    | { auth: HttpAuthObject; headers: Record<string, string> }

  /**
   * Resolved auth configuration (pre-computed headers/token)
   * Derived from selected Auth config
   * For convenience, auth headers are pre-computed so developers
   * don't need to handle different auth types manually.
   */
  const $auth: ExternalTestCaseAuth

  // ============================================================================
  // LOGGING AND API REPORTING
  // ============================================================================

  /**
   * Log level for test case execution logs
   */
  type ExternalTestCaseLogLevel = 'info' | 'warn' | 'error' | 'debug'

  /**
   * Log a message during test case execution.
   * Logs are collected and displayed in the test results UI.
   *
   * @param level - Log level: 'info' | 'warn' | 'error' | 'debug'
   * @param message - The log message
   * @param data - Optional additional data to log (will be serialized)
   *
   * @example
   * $log('info', 'Starting test')
   * $log('debug', 'Request payload', { userId: 123 })
   * $log('error', 'Unexpected response', response)
   */
  function $log(level: ExternalTestCaseLogLevel, message: string, data?: any): void

  /**
   * API request/response report structure
   */
  interface ApiRequestReport {
    /** Optional name/label for this request (e.g., 'Get User Profile') */
    name?: string
    request: {
      method: string
      url: string
      headers?: Record<string, string>
      body?: any
    }
    response: {
      status: number
      statusText: string
      headers?: Record<string, string>
      body?: any
    }
    /** Request duration in milliseconds */
    duration?: number
  }

  /**
   * Report an API request/response pair during test case execution.
   * Useful for tracking all HTTP calls made during the test.
   * Reports are collected and displayed in the test results UI.
   *
   * @param report - The API request/response report
   *
   * @example
   * const start = Date.now()
   * const response = await fetch(url, { method: 'GET', headers })
   * const body = await response.json()
   *
   * $reportApiRequest({
   *   name: 'Get User Profile',
   *   request: { method: 'GET', url, headers },
   *   response: {
   *     status: response.status,
   *     statusText: response.statusText,
   *     body
   *   },
   *   duration: Date.now() - start
   * })
   */
  function $reportApiRequest(report: ApiRequestReport): void

  /**
   * Definition for a test case.
   * Test cases are functions that perform API calls and assertions.
   */
  interface TestCaseDefinition {
    /** Unique identifier for this test case */
    id: string
    /** Display name shown in the UI */
    name: string
    /** Description of what the test case validates */
    description?: string
    /** Tags for filtering and organization (e.g., ['smoke', 'auth']) */
    tags?: string[]
    /** Priority level (e.g., 1, 2, 3) */
    priority?: number
    /** Timeout in milliseconds (default: 30000) */
    timeout?: number
    /** The test function implementation */
    function: () => Promise<void>
  }
}

export {}
