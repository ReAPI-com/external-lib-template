# Testing Guide for External Library Components

This guide explains how to write tests for each component type in your ReAPI external library.

## Why Testing Matters

When your library runs in ReAPI, it executes in a sandboxed environment (Web Worker or Node VM) with platform-injected globals like `$request`, `$response`, `$context`, and `$addAssertionResult`. Your tests need to mock these globals to verify your code works correctly before deployment.

## Test Patterns by Component Type

### 1. Assertion Functions

Assertions validate data and report results via `$addAssertionResult`.

**Available Globals:**

- `$addAssertionResult(result)` - Report pass/fail with details

**Test Pattern:**

```typescript
import { beforeEach, describe, expect, it } from 'vitest'
import { myAssertion } from './myAssertion'

describe('myAssertion', () => {
  let assertionResults: {
    passed: boolean
    leftValue?: any
    message?: string
  }[] = []

  beforeEach(() => {
    assertionResults = []
    // @ts-ignore
    globalThis.$addAssertionResult = (result) => {
      assertionResults.push(result)
    }
  })

  it('should pass for valid input', () => {
    myAssertion('valid-value')

    expect(assertionResults).toHaveLength(1)
    expect(assertionResults[0].passed).toBe(true)
  })

  it('should fail for invalid input', () => {
    myAssertion('invalid-value')

    expect(assertionResults).toHaveLength(1)
    expect(assertionResults[0].passed).toBe(false)
  })
})
```

**What to Verify:**

- `assertionResults[0].passed` - Did the assertion pass or fail?
- `assertionResults[0].leftValue` - Was the actual value captured?
- `assertionResults[0].message` - Is the message helpful?

---

### 2. Value Generators / Transformers

Value generators produce dynamic values. Transformers convert input to output.

**Available Globals:** None - these are pure functions.

**Test Pattern:**

```typescript
import { describe, expect, it } from 'vitest'
import { myGenerator, myTransformer } from './myFunctions'

describe('value generators', () => {
  // Generator with no params (noOfParams: 0)
  it('should generate a value', () => {
    const result = myGenerator()

    expect(result).toBeDefined()
    expect(typeof result).toBe('string') // or whatever type expected
  })

  // Transformer with params (noOfParams: 1)
  it('should transform input', () => {
    const result = myTransformer(1234567890)

    expect(result).toBe('expected-output')
  })
})
```

**What to Verify:**

- Return value type and format
- Edge cases (null, undefined, empty values)
- Expected transformations

---

### 3. beforeRequest Hooks

These hooks run before sending an API request and can modify the request.

**Available Globals:**

- `$request` - The outgoing request (method, url, headers, query, body)
- `$context` - Shared context object

**Test Pattern:**

```typescript
import { beforeEach, describe, expect, it } from 'vitest'
import { myBeforeRequestHook } from './myHook'

describe('myBeforeRequestHook', () => {
  beforeEach(() => {
    // @ts-ignore
    globalThis.$request = {
      method: 'GET',
      url: 'https://api.example.com/users',
      headers: {},
      query: {},
      body: null,
    }

    // @ts-ignore
    globalThis.$context = {
      authToken: 'test-token',
    }
  })

  it('should add authorization header', async () => {
    await myBeforeRequestHook()

    expect($request.headers['Authorization']).toBe('Bearer test-token')
  })

  it('should update context', async () => {
    await myBeforeRequestHook()

    expect($context.requestPrepared).toBe(true)
  })
})
```

**What to Verify:**

- Headers are added/modified correctly
- Query parameters are set
- Context is updated as expected
- Existing values are preserved

---

### 4. afterResponse Hooks

These hooks run after receiving an API response and can process the data.

**Available Globals:**

- `$request` - The original request
- `$response` - The received response (status, statusText, headers, data)
- `$context` - Shared context object

**Test Pattern:**

```typescript
import { beforeEach, describe, expect, it } from 'vitest'
import { myAfterResponseHook } from './myHook'

describe('myAfterResponseHook', () => {
  beforeEach(() => {
    // @ts-ignore
    globalThis.$request = {
      method: 'GET',
      url: 'https://api.example.com/users',
      headers: {},
      query: {},
      body: null,
    }

    // @ts-ignore
    globalThis.$response = {
      status: 200,
      statusText: 'OK',
      headers: { 'content-type': 'application/json' },
      data: { users: [{ id: 1, name: 'John' }] },
    }

    // @ts-ignore
    globalThis.$context = {}
  })

  it('should extract data to context', async () => {
    await myAfterResponseHook()

    expect($context.userCount).toBe(1)
  })

  it('should handle null response data', async () => {
    $response.data = null

    // Should not throw
    await myAfterResponseHook()
  })
})
```

**What to Verify:**

- Response data is processed correctly
- Context is updated with extracted values
- Null/undefined data is handled gracefully
- Error responses (4xx, 5xx) are handled

---

## Quick Reference

| Component Type       | Globals to Mock                       | What to Verify                  |
| -------------------- | ------------------------------------- | ------------------------------- |
| Assertion            | `$addAssertionResult`                 | `passed`, `leftValue`, `message`|
| Value Generator      | None                                  | Return value                    |
| beforeRequest Hook   | `$request`, `$context`                | Request modifications           |
| afterResponse Hook   | `$request`, `$response`, `$context`   | Context updates, data handling  |

## Running Tests

```bash
# Run all tests
npm test

# Run tests once (no watch)
npm test -- --run

# Run specific test file
npm test -- src/assertion/isInt.test.ts
```

## Tips

1. **Reset state in `beforeEach`** - Ensure each test starts with clean mock data
2. **Test edge cases** - null, undefined, empty strings, invalid types
3. **Test async functions** - Use `async/await` in your tests
4. **Use `@ts-ignore`** - For globalThis assignments that TypeScript doesn't recognize
5. **Check array lengths** - Verify exactly one assertion result was added

