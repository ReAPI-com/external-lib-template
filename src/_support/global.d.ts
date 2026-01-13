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
  const $server: {
    baseUrl: string
    name: string
    id: string
  }

  /**
   * Resolved auth configuration (pre-computed headers/token)
   * Derived from selected Auth config
   * For convenience, auth headers are pre-computed so developers
   * don't need to handle different auth types manually.
   */
  const $auth: {
    type: 'bearer' | 'apiKey' | 'basic' | 'none'
    headers: Record<string, string>
    token?: string
    apiKey?: string
    apiKeyHeader?: string
  }

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
