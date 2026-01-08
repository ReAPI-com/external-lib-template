# Writing Functions Compatible with ReAPI Platform

ReAPI allows developers to extend its capabilities by writing custom assertions, value generators, API hooks, and utility classes.

## Core Types

See [`src/_support/global.d.ts`](src/_support/global.d.ts) for type definitions:

- `AssertionDefinition` - Custom assertion function metadata
- `ValueGeneratorDefinition` - Value generator/transformer metadata
- `HookDefinition` - API hook metadata
- `UtilityDefinition` - Utility class metadata

## Platform-Injected Globals

| Global                | Available In        | Description                     |
| --------------------- | ------------------- | ------------------------------- |
| `$request`            | Hooks               | The API request object          |
| `$response`           | afterResponse hooks | The API response object         |
| `$context`            | Hooks               | Shared context for data passing |
| `$addAssertionResult` | Assertions          | Report assertion pass/fail      |

## Component Registration

Components are registered using wrapper functions that attach metadata. The build script automatically scans and generates the registration arrays.

### Registration Helpers

Import from `src/_support/decorators.ts`:

```typescript
import { assertion, valueGenerator, hook, Utility } from '../_support/decorators'
```

---

## Component Types

### 1. Assertion Functions

Assertions validate data and report results via `$addAssertionResult()`.

**Registration Pattern:**

```typescript
import { assertion } from '../_support/decorators'

export const isInt = assertion(
  {
    id: 'my-lib-is-int',
    displayName: 'Is Integer',
    description: 'Validates that the value is an integer',
    noOfParams: 1,
  },
  function isInt(value: number) {
    const passed = Number.isInteger(value)
    $addAssertionResult({ passed, leftValue: value, message: '...' })
  }
)
```

**Examples by parameter count:**

| Params | Example                              | Source                                                             |
| ------ | ------------------------------------ | ------------------------------------------------------------------ |
| 1      | `isInt(value)`                       | [`src/assertion/isInt.ts`](src/assertion/isInt.ts)                 |
| 2      | `isGreaterThan(actual, expected)`    | [`src/assertion/isGreaterThan.ts`](src/assertion/isGreaterThan.ts) |
| 3      | `isCloseTo(actual, expected, delta)` | [`src/assertion/isCloseTo.ts`](src/assertion/isCloseTo.ts)         |

**Rules:**

- Accept 1, 2, or 3 parameters
- Must call `$addAssertionResult()` to report results
- Use Zod for runtime parameter validation (see examples)

---

### 2. Value Generators / Transformers

Value generators produce dynamic values. Transformers convert input to output.

**Registration Pattern:**

```typescript
import { valueGenerator } from '../_support/decorators'

export const now = valueGenerator(
  {
    id: 'my-lib-now',
    displayName: 'Now',
    description: 'Get the current date and time',
    noOfParams: 0,
  },
  function now() {
    return new Date().toISOString()
  }
)
```

**Examples:**

| Type        | Params | Example               | Source                                                       |
| ----------- | ------ | --------------------- | ------------------------------------------------------------ |
| Generator   | 0      | `now()`               | [`src/generator/dateTime.ts`](src/generator/dateTime.ts)     |
| Transformer | 1      | `formatTimestamp(ts)` | [`src/transformer/dateTime.ts`](src/transformer/dateTime.ts) |

**Rules:**

- Must return a value
- Accept 0 or 1 parameter only
- Handle undefined/null inputs gracefully

---

### 3. API Hooks

Hooks run before requests or after responses to modify data.

**Registration Pattern:**

```typescript
import { hook } from '../_support/decorators'

export const addAuth = hook(
  {
    id: 'my-lib-add-auth',
    displayName: 'Add Authorization',
    description: 'Adds auth header to request',
    type: 'BEFORE_REQUEST',
  },
  async function addAuth() {
    $request.headers['Authorization'] = 'Bearer ' + $context.token
  }
)
```

**Examples:**

| Type          | Example                 | Source                                                               |
| ------------- | ----------------------- | -------------------------------------------------------------------- |
| beforeRequest | `modifyRequestParams()` | [`src/hook/modifyRequestParams.ts`](src/hook/modifyRequestParams.ts) |
| afterResponse | `modifyResponseData()`  | [`src/hook/modifyResponseData.ts`](src/hook/modifyResponseData.ts)   |

**Available globals:**

- **beforeRequest**: `$request`, `$context`
- **afterResponse**: `$request`, `$response`, `$context`

---

### 4. Utility Classes

Utility classes provide helper methods available globally in scripts.

**Registration Pattern:**

```typescript
import { Utility } from '../_support/decorators'

@Utility({
  id: 'StringUtils',
  displayName: 'String Utilities',
  description: 'String manipulation helpers',
})
export class StringUtils {
  static toUpperCase(str: string) {
    return str.toUpperCase()
  }
}
```

**Examples:**

| Utility        | Source                                                   |
| -------------- | -------------------------------------------------------- |
| `GeoUtils`     | [`src/utility/GeoUtils.ts`](src/utility/GeoUtils.ts)     |
| `StringUtils`  | [`src/utility/StringUtils.ts`](src/utility/StringUtils.ts) |
| `NumberUtils`  | [`src/utility/NumberUtils.ts`](src/utility/NumberUtils.ts) |

**Rules:**

- All methods must be `static`
- Class is available globally as `CustomLib.StringUtils.methodName()`

---

## Build Process

The build process automatically discovers and registers components:

```bash
pnpm build
# 1. Scans for assertion(), valueGenerator(), hook() calls
# 2. Scans for @Utility decorated classes
# 3. Generates src/_generated/registry.ts
# 4. Bundles everything into dist/
```

You can run the generator separately:

```bash
pnpm generate  # Only regenerate registry
```

## Best Practices

### ID Naming

- Use a prefix to avoid conflicts: `my-lib-function-name`
- IDs are permanent - once used in tests, don't change them

### Parameter Validation

- Use Zod for runtime validation (see assertion examples)
- Declare correct types in function signature for IDE support

### Deprecation

- Never remove functions used in existing tests
- Set `deprecated: true` to hide from UI while keeping existing tests working

### Testing

- Set `tested: true` only after thorough testing
- See [`TESTING.md`](TESTING.md) for testing patterns

## Summary

| Component       | Array             | Params    | Must Return | Platform API                               |
| --------------- | ----------------- | --------- | ----------- | ------------------------------------------ |
| Assertion       | `assertions`      | 1, 2 or 3 | No          | `$addAssertionResult()`                    |
| Value Generator | `valueGenerators` | 0 or 1    | Yes         | None                                       |
| Hook            | `hooks`           | 0         | No          | Modify `$request`, `$response`, `$context` |
