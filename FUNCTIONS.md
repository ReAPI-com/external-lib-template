# Writing Functions Compatible with ReAPI Platform

ReAPI allows developers to extend its capabilities by writing custom assertion and value functions. However, to ensure seamless integration with the platform, these functions must adhere to specific rules and guidelines.

## Core Types and Configuration

The core types and configuration details are located in `_support/global.d.ts` and `index.ts`, where you can find the exact structure and types that will be referenced in this guide.

## Key Guidelines for Writing Compatible Functions

### 1. Registration Requirements

Both assertion and value functions must be added to their respective containers:

- **Assertion Functions:** `$$AssertionFunctions`
- **Value Functions:** `$$ValueFunctions`

These containers will be scanned by the ReAPI platform and registered accordingly.

### 2. Metadata Requirements

When adding functions to the respective containers, metadata must be provided. The required metadata includes:

- **`ID`** (Unique Identifier): Must be unique across the project. Once used in the ReAPI platform, the reference will be permanently linked to the ID.
  - **Important:** Disabling or removing a function will result in errors, as references will become invalid.
  - To retire a function, set `deprecated=true` in the metadata to prevent further use without breaking existing tests.
- **`Title`**: A meaningful, human-readable name.
- **`Description`**: A brief explanation of what the function does.

Example:

```javascript
import { isPositiveNumber } from "assertion/isPositiveNumber";

$$AssertionFunctions.push({
  id: "isPositiveNumber",
  title: "Check if value is a positive number",
  description: "Validates if the given value is a positive number",
  func: isPositiveNumber,
});
```

### 3. Function Parameters

Each function must adhere to the following parameter rules:

- **Assertion Functions:**

  - Accept only 1 or 2 parameters.
  - Example with 1 parameter: `isString(value)`
  - Example with 2 parameters: `isGreaterThan(valueA, valueB)`

- **Value Functions:**

  - Accept 0 or 1 parameter.
  - Should gracefully handle undefined values by providing default options.

### 4. Async Support

Asynchronous functions are fully supported; however, the `await` keyword must be used properly to ensure sequential execution and avoid race conditions.

Example:

```javascript
async function isApiResponseValid(response) {
  const validationResult = await someAsyncValidation(response);
  $addAssertionResult({ passed: validationResult, leftValue: response });
}
```

### 5. Reporting Assertion Results

For assertion functions, it's mandatory to use the ReAPI API `$addAssertionResult()` to report the result. This function integrates validation results into the platform for reporting and debugging.

Example:

```javascript
function validateEmail(value) {
  if (/^[\w-.]+@[\w-]+\.[a-z]{2,4}$/.test(value)) {
    $addAssertionResult({ passed: true, leftValue: value });
  } else {
    $addAssertionResult({
      passed: false,
      leftValue: value,
      message: "Invalid email format",
    });
  }
}
```

### 6. Value Function Return Requirement

Value functions **must return a value**. If no value is returned, `undefined` will be returned by default, which may lead to unexpected behaviors in test cases.

Example:

```javascript
function generateRandomNumber() {
  return Math.floor(Math.random() * 100);
}
```

## Best Practices

- **Use Clear and Consistent Naming:**

  - Function names should be descriptive and follow a consistent pattern.

- **Handle All Edge Cases:**

  - Ensure functions handle null, undefined, and edge values gracefully.

- **Document Your Functions:**

  - Add clear JSDoc comments to explain the purpose and expected behavior.

- **Avoid Breaking Changes:**

  - Once enabled, do not remove functions used in existing tests. Instead, mark them as deprecated.

- **Test Thoroughly Before Enabling:**

  - Ensure all functions are well-tested before enabling them in the platform.

## Summary Table

| Function Type | Parameter Rules   | Return Type         | Mandatory API Call      |
| ------------- | ----------------- | ------------------- | ----------------------- |
| Assertion     | 1 or 2 parameters | None                | `$addAssertionResult()` |
| Value         | 0 or 1 parameter  | Must return a value | Not required            |

By following these guidelines, developers can ensure their functions integrate smoothly with ReAPI, enhancing test capabilities while maintaining robustness and consistency.
