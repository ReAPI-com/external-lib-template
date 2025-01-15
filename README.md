# ReAPI External Library Template

This template demonstrates how to create a custom library for ReAPI scripts with proper TypeScript support and bundling.

## Implementation Guide

### 1. Bundle Name Configuration

The bundle name must be unique across your ReAPI environment. In this template, we use `$$CustomLib` as the global namespace (you can replace this with your own library name, e.g., `$$MyAwesomeLib`). This name is used consistently in:

- `rollup.config.js` for bundle configuration
- `index.ts` for global type declarations

### 2. Export and Type Declaration Pattern

Always follow this pattern when exposing your APIs `src/index.ts`:

```typescript
declare global {
  const $$CustomLib: {
    YourClass: typeof YourClass;
    yourFunction: typeof yourFunction;
  };
}
export { YourClass, yourFunction };
```

This pattern ensures both:

- Type information is available in ReAPI's web editor
- Functions/classes are accessible globally in ReAPI scripts via `$$CustomLib.YourClass`

### 3. Dependencies

When using third-party libraries, ensure they are browser-compatible. ReAPI's web executor cannot access Node.js-specific APIs. Common examples of compatible libraries include:

- CryptoJS
- Moment.js
- Browser-compatible portions of utility libraries

### 4. Type Definition Bundling

The project uses `dts-bundle-generator` to bundle TypeScript declarations. Key configuration in `dts.config.json`:

```json
{
  "libraries": {
    "inlinedLibraries": ["@turf/helpers", "geojson"]
  },
  "output": {
    "inlineDeclareGlobals": true
  }
}
```

This configuration:

- Bundles type definitions from dependencies into your final `bundle.d.ts`
- Ensures proper type declaration tree-shaking
- **Important**: The `inlinedLibraries` array must include any packages whose type definitions you want to be included in your final bundle. For example:
  - If your library depends on turf.js, you need to include `"@turf/helpers"` and `"geojson"` as they contain the required type definitions
  - Without listing dependencies here, their type definitions won't be available in your bundled `bundle.d.ts` file

## Getting Started

1. Clone this template
2. Update the bundle name (`$$CustomLib`) to your unique identifier
3. Update the `name` field in `package.json` to match your organization (e.g., `@your-org/custom-lib`)
4. Add your code in `src/`
5. Build using:

```bash
npm install
npm run build
```

The built library will be available in the `dist/` directory:

- `bundle.js`: Your bundled library
- `bundle.d.ts`: TypeScript declarations

## Publishing and Deployment

1. Publish your library to npm:

```bash
npm publish
```

2. After publishing, wait a few minutes for the package to be available on CDN providers like unpkg.

3. Register or update the library in ReAPI:

   - Navigate to ReAPI's external library management UI
   - Add/update the library with specific version CDN URLs for both JS and TypeScript definitions:
     ```
     JS: https://unpkg.com/your-package@1.0.0/dist/bundle.js
     Types: https://unpkg.com/your-package@1.0.0/dist/bundle.d.ts
     ```
     > **Note:** Avoid using 'latest' in CDN URLs. Always specify exact version numbers for stability.

4. Enable the library in ReAPI's UI.

5. **Important**: You might need to reload the ReAPI web page to ensure the new library URLs take effect.

6. Your library is now ready to use in ReAPI scripts!

## Usage in ReAPI Scripts

After deploying your library, you can use it in ReAPI scripts:

```typescript
// Your library is available globally
const result = $$CustomLib.yourFunction();
const value = $$CustomLib.yourClass.someFunction();
```

### Usage in ReAPI Test Components

Your external library can be utilized in ReAPI's test components:

- **Custom Assertion Functions**: Create custom assertions using your library's validation logic
- **Value Generators/Transformers**: Generate test data or transform API responses
- **API Hooks**: Enhance request/response handling in pre and post hooks

## Development Tips

### Local Development with AI Assistants

You can develop your library locally with your preferred IDE and AI coding assistants:

1. Use VS Code, WebStorm, or any TypeScript-capable IDE
2. Set up your favorite AI assistant (e.g., GitHub Copilot, Codeium, TabNine)
3. Leverage TypeScript for better code completion and error detection
4. Test your code locally before publishing

### Testing

Always thoroughly test your library before publishing:

```typescript
// src/__tests__/yourFunction.test.ts
describe("yourFunction", () => {
  it("should work as expected", () => {
    const result = yourFunction();
    expect(result).toBe(expectedValue);
  });
});
```

Run tests with:

```bash
npm test
```

### Type Definition Considerations

While `dts-bundle-generator` works well for most cases, you might encounter scenarios where manual type definition is necessary:

1. Complex type hierarchies might not bundle correctly
2. Some third-party library types might be incompatible
3. Custom type augmentations might need manual handling

In such cases, consider maintaining a manual `bundle.d.ts`:

```typescript
// manually maintained bundle.d.ts
declare global {
  const $$CustomLib: {
    // Manually specify your types here
    YourClass: {
      new (): {
        someMethod(): void;
      };
    };
    yourFunction(): string;
  };
}

export {};
```
