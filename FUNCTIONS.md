# Writing Functions Compatible with ReAPI Platform

ReAPI allows developers to extend its capabilities by writing custom assertions, value generators, and API hooks.

## Core Types

See [`src/_support/global.d.ts`](src/_support/global.d.ts) for type definitions:

- `AssertionDefinition` - Custom assertion function metadata
- `ValueGeneratorDefinition` - Value generator/transformer metadata
- `HookDefinition` - API hook metadata

## Platform-Injected Globals

| Global                | Available In        | Description                     |
| --------------------- | ------------------- | ------------------------------- |
| `$request`            | Hooks               | The API request object          |
| `$response`           | afterResponse hooks | The API response object         |
| `$context`            | Hooks               | Shared context for data passing |
| `$addAssertionResult` | Assertions          | Report assertion pass/fail      |

## Component Types

### 1. Assertion Functions

Assertions validate data and report results via `$addAssertionResult()`.

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

**Examples:**

| Type          | Example                 | Source                                                               |
| ------------- | ----------------------- | -------------------------------------------------------------------- |
| beforeRequest | `modifyRequestParams()` | [`src/hook/modifyRequestParams.ts`](src/hook/modifyRequestParams.ts) |
| afterResponse | `modifyResponseData()`  | [`src/hook/modifyResponseData.ts`](src/hook/modifyResponseData.ts)   |

**Available globals:**

- **beforeRequest**: `$request`, `$context`
- **afterResponse**: `$request`, `$response`, `$context`

---

## Registration

Add components to the arrays in [`src/index.ts`](src/index.ts):

```typescript
const assertions: AssertionDefinition[] = [...]
const valueGenerators: ValueGeneratorDefinition[] = [...]
const hooks: HookDefinition[] = [...]
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
