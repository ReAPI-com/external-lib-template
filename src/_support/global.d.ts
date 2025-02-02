interface AssertionResult {
  /**
   * Indicates whether the assertion passed or failed.
   */
  passed: boolean;
  /**
   * The actual value obtained during the test.
   */
  leftValue?: any;
  /**
   * The expected value to compare against the actual value.
   */
  rightValue?: any;
  /**
   * Additional options for the assertion.
   */
  options?: any;
  /**
   * A message describing the outcome of the assertion.
   */
  message?: string;
  /**
   * Optional metadata related to the assertion.
   */
  meta?: any;
}

declare global {
  interface AssertionFunction {
    id: string;
    deprecated?: boolean;
    tested: boolean;
    enabled: boolean;
    noOfParams: number; // only 1, 2
    function: Function;
    displayName?: string;
    description?: string;
  }

  interface ValueFunction {
    id: string;
    deprecated?: boolean;
    tested: boolean;
    enabled: boolean;
    function: Function;
    // accept 0 or 1 params. For complex options, use { options }
    // default is 1
    noOfParams: 0 | 1;
    displayName?: string;
    description?: string;
  }

  interface ApiHook {
    id: string;
    deprecated?: boolean;
    tested: boolean;
    enabled: boolean;
    displayName: string;
    description?: string;
    type: "beforeRequest" | "afterRequest";
    function: Function;
  }

  interface ApiRequest {
    method: string;
    url: string;
    query: Record<string, any>;
    headers: Record<string, any>;
    body: any;
  }

  interface ApiResponse {
    status: number;
    statusText: string;
    headers: Record<string, any>;
    data?: Record<string, any> | null | undefined;
  }

  type Json = Record<string, any>;

  const $request: ApiRequest;
  const $response: ApiResponse;
  const $context: Record<string, any>;

  function $addAssertionResult(result: AssertionResult): void;
  function $setGeneratedValue(value: any): void;
}

export { };

