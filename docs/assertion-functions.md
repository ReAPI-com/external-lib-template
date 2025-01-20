# Registering Assertion Functions

Besides global utilities, you can also write and register assertion functions directly from your external library. Once registered, these functions will automatically appear in ReAPI's no-code editor. However, there are strict rules to follow due to ReAPI's script loader restrictions.

## Implementation Rules

### 1. Assertion Function Parameters

Assertion functions must follow one of these two parameter patterns:

1. **Single Parameter Assertions**

   - Takes exactly one parameter to validate
   - Used for type checking or value validation
   - Examples: `isString(value)`, `isNumber(value)`, `isNotEmpty(value)`

2. **Two Parameter Assertions**
   - Takes exactly two parameters to compare
   - Used for comparison operations
   - Examples: `isEqual(valueA, valueB)`, `isGreaterThan(valueA, valueB)`

No other parameter configurations are supported in the ReAPI assertion system.

### 2. Dependency Restrictions

Due to script loader restrictions, assertion functions can only use:

- JavaScript standard APIs
- Global utility functions exposed in your source code

**Important**: External dependencies must be accessed through global utilities, not directly in assertion functions.

Example:

```javascript
// ❌ Wrong - Direct use of external library
function isValidNumber(value) {
  return lodash.isNumber(value);
}

// ✅ Correct - Using global utility
function isValidNumber(value) {
  return NumberUtils.isNumber(value);
}
```

Note: Your global utility functions can freely use external dependencies. This restriction only applies to assertion functions due to the way code bundling interacts with the script loader.

### 3. Result Reporting

All assertion functions must use the `$addAssertionResult` API to report results to the ReAPI platform. This integration is essential for generating assertion results in reports and the UI.

```javascript
// Example of proper result reporting
function isPositiveNumber(value) {
  const result = NumberUtils.isNumber(value) && value > 0;
  $addAssertionResult({
    passed: result,
    message: result
      ? "Value is a positive number"
      : "Value must be a positive number",
  });
  return result;
}
```

- Check out `assertions.ts` for more examples
- See `global.d.ts` for the type definition of `$addAssertionResult`

### 4. Function Registration and Versioning

Each assertion function must be registered with a unique ID that serves as a permanent identifier. Critical rules:

- Function IDs must never be changed once deployed
- Registered functions must never be removed
- Breaking either rule will cause test cases referencing these functions to fail loading

When registering external libraries, always specify exact version URLs:

```javascript
// ❌ Wrong - Using latest version
registerAssertionLib("https://cdn.example.com/lib/latest/assertions.js");

// ✅ Correct - Using specific version
registerAssertionLib("https://cdn.example.com/lib/v1.2.3/assertions.js");
```

### 5. Registering in $$AssertionFunctions

All assertion functions must be added to the `$$AssertionFunctions` array. Required metadata:

```typescript
import { isInt } from "./assertions";

const $$AssertionFunctions: AssertionFunction[] = [
  {
    id: "my-is-int", // Unique identifier
    parameterType: "one", // "one" or "two"
    function: isInt, // Reference to the function
    displayName: "Is Integer", // Optional: friendly name for UI
    description: "Checks if value is an integer", // Optional: description for UI
  },
];

export { $$AssertionFunctions };
```

### 6. Deployment Steps

Once you have implemented, tested, and completed all the above requirements for your assertion function:

1. Follow the deployment steps in `README.md` to publish your changes
2. Update the external library version in your ReAPI configuration
3. Test the newly deployed assertion function in the ReAPI no-code editor to verify it appears and functions correctly
