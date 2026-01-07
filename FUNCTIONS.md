# Writing Functions Compatible with ReAPI Platform

ReAPI allows developers to extend its capabilities by writing custom assertions, value generators, and API hooks. This guide explains how to write functions that integrate seamlessly with the platform.

## Core Types and Configuration

The core types are defined in `src/_support/global.d.ts`:

- `AssertionDefinition` - Custom assertion function metadata
- `ValueGeneratorDefinition` - Value generator/transformer metadata
- `HookDefinition` - API hook metadata

## Platform-Injected Globals

When your functions run in ReAPI, these globals are available:

| Global                | Available In        | Description                     |
| --------------------- | ------------------- | ------------------------------- |
| `$request`            | Hooks               | The API request object          |
| `$response`           | afterResponse hooks | The API response object         |
| `$context`            | Hooks               | Shared context for data passing |
| `$addAssertionResult` | Assertions          | Report assertion pass/fail      |

## Component Types

### 1. Assertion Functions

Assertions validate data and report results.

**Registration Array:** `assertions`

**Interface:** `AssertionDefinition`

```typescript
interface AssertionDefinition {
  id: string // Unique identifier (permanent once used)
  displayName?: string // Human-readable name
  description?: string // What the assertion does
  noOfParams: number // 1 or 2 parameters
  function: Function // The assertion function
  enabled: boolean // Whether available in UI
  tested: boolean // Whether thoroughly tested
  deprecated?: boolean // Mark as deprecated instead of removing
}
```

**Example:**

```typescript
// src/assertion/isPositiveNumber.ts
export function isPositiveNumber(value: any) {
  const passed = typeof value === 'number' && value > 0

  $addAssertionResult({
    passed,
    leftValue: value,
    message: passed ? 'Value is positive' : 'Value is not a positive number',
  })
}

export const isPositiveNumberAssertion: AssertionDefinition = {
  id: 'my-lib-is-positive-number',
  displayName: 'Is Positive Number',
  description: 'Validates if the value is a positive number',
  noOfParams: 1,
  function: isPositiveNumber,
  enabled: true,
  tested: true,
}
```

**Rules:**

- Accept 1 or 2 parameters only
- Must call `$addAssertionResult()` to report results
- Use 2 params for comparisons: `isGreaterThan(actual, expected)`

---

### 2. Value Generators / Transformers

Value generators produce dynamic values. Transformers convert input to output.

**Registration Array:** `valueGenerators`

**Interface:** `ValueGeneratorDefinition`

```typescript
interface ValueGeneratorDefinition {
  id: string // Unique identifier
  displayName?: string // Human-readable name
  description?: string // What the generator does
  noOfParams: 0 | 1 // 0 = no input, 1 = takes input
  function: Function // The generator function
  enabled: boolean
  tested: boolean
  deprecated?: boolean
}
```

**Example - Generator (no params):**

```typescript
// src/generator/uuid.ts
export function generateUuid() {
  return crypto.randomUUID()
}

export const uuidGenerator: ValueGeneratorDefinition = {
  id: 'my-lib-uuid',
  displayName: 'UUID',
  description: 'Generate a random UUID',
  noOfParams: 0,
  function: generateUuid,
  enabled: true,
  tested: true,
}
```

**Example - Transformer (1 param):**

```typescript
// src/transformer/uppercase.ts
export function toUpperCase(value: string) {
  return value?.toUpperCase() ?? ''
}

export const upperCaseTransformer: ValueGeneratorDefinition = {
  id: 'my-lib-uppercase',
  displayName: 'To Upper Case',
  description: 'Convert string to uppercase',
  noOfParams: 1,
  function: toUpperCase,
  enabled: true,
  tested: true,
}
```

**Rules:**

- Must return a value
- Accept 0 or 1 parameter only
- Handle undefined/null inputs gracefully

---

### 3. API Hooks

Hooks run before requests or after responses to modify data.

**Registration Array:** `hooks`

**Interface:** `HookDefinition`

```typescript
interface HookDefinition {
  id: string
  displayName: string // Required for hooks
  description?: string
  type: 'beforeRequest' | 'afterRequest'
  function: Function
  enabled: boolean
  tested: boolean
  deprecated?: boolean
}
```

**Example - beforeRequest Hook:**

```typescript
// src/hook/addAuthHeader.ts
export async function addAuthHeader() {
  $request.headers['Authorization'] = `Bearer ${$context.token}`
  $request.headers['X-Request-Id'] = crypto.randomUUID()
}

export const addAuthHeaderHook: HookDefinition = {
  id: 'my-lib-add-auth-header',
  displayName: 'Add Auth Header',
  description: 'Adds authorization header from context',
  type: 'beforeRequest',
  function: addAuthHeader,
  enabled: true,
  tested: true,
}
```

**Example - afterResponse Hook:**

```typescript
// src/hook/extractToken.ts
export async function extractToken() {
  if ($response.data?.token) {
    $context.token = $response.data.token
  }
  $context.lastStatus = $response.status
}

export const extractTokenHook: HookDefinition = {
  id: 'my-lib-extract-token',
  displayName: 'Extract Token',
  description: 'Extracts token from response to context',
  type: 'afterRequest',
  function: extractToken,
  enabled: true,
  tested: true,
}
```

**Available in beforeRequest:**

- `$request` - Modify headers, query, body
- `$context` - Read/write shared data

**Available in afterResponse:**

- `$request` - Read original request
- `$response` - Read/modify response data
- `$context` - Read/write shared data

---

## Registration in index.ts

Add your components to the registration arrays:

```typescript
// src/index.ts
import { isPositiveNumberAssertion } from './assertion/isPositiveNumber'
import { uuidGenerator } from './generator/uuid'
import { addAuthHeaderHook } from './hook/addAuthHeader'

const assertions: AssertionDefinition[] = [
  isPositiveNumberAssertion,
  // ... more assertions
]

const valueGenerators: ValueGeneratorDefinition[] = [
  uuidGenerator,
  // ... more generators
]

const hooks: HookDefinition[] = [
  addAuthHeaderHook,
  // ... more hooks
]
```

## Async Support

All function types support async/await:

```typescript
async function validateWithApi(value: any) {
  const result = await fetch(`https://api.example.com/validate?v=${value}`)
  const data = await result.json()

  $addAssertionResult({
    passed: data.valid,
    leftValue: value,
    message: data.message,
  })
}
```

## Best Practices

### ID Naming

- Use a prefix to avoid conflicts: `my-lib-function-name`
- IDs are permanent - once used in tests, don't change them

### Deprecation

- Never remove functions used in existing tests
- Set `deprecated: true` to hide from UI while keeping existing tests working

### Error Handling

- Handle null/undefined inputs gracefully
- Provide meaningful error messages

### Testing

- Set `tested: true` only after thorough testing
- See `TESTING.md` for testing patterns

## Summary Table

| Component       | Array             | Params | Must Return | Platform API                               |
| --------------- | ----------------- | ------ | ----------- | ------------------------------------------ |
| Assertion       | `assertions`      | 1 or 2 | No          | `$addAssertionResult()`                    |
| Value Generator | `valueGenerators` | 0 or 1 | Yes         | None                                       |
| Hook            | `hooks`           | 0      | No          | Modify `$request`, `$response`, `$context` |
