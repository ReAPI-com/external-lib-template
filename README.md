# ReAPI External Library Template

The ReAPI External Library Template is a ready-to-use project designed to empower QA teams by enabling developers to register global utility functions, custom assertion functions, value functions, and API hooks.

With this template, developers can write code just like a standard Node.js project, leveraging any browser-compatible dependencies.

## Quick Overview

Here's the high-level workflow to create and use your own external library:

1. **Clone** - Clone this template repository
2. **Modify** - Add your custom functions, assertions, value generators, and hooks
3. **Configure** - Set up `reapi.config.json` with your component ID
4. **Build & Sync** - Run `npm run publish:reapi` to build and sync to ReAPI

Once synced, your library is globally available in all ReAPI scripts!

### Using ReAPI CLI (Recommended)

The easiest way to publish your library is using the ReAPI CLI:

```bash
# One command to build and sync
npm run publish:reapi

# Or separately
npm run build
npm run sync
```

This automatically uploads your library to ReAPI's CDN and registers the metadata.

## Key Files Overview

Before diving into implementation, familiarize yourself with these essential files:

1. `reapi.config.json` ⭐ **NEW**
   - Configuration for ReAPI CLI sync
   - Contains `componentId` (get this from ReAPI platform)
   - Contains `libName` (your library's global namespace)

2. `src/index.ts`
   - Central export file
   - Manages global type declarations and exports
   - Defines the structure of your library's public API

3. `src/_support/global.d.ts`
   - Contains core type declarations
   - Defines global interfaces and types
   - Essential for TypeScript integration

4. `rollup.config.js`
   - Configures bundle generation
   - Defines your library's global namespace (e.g., `CustomLib`)
   - Manages build optimization settings

5. `dts.config.json`
   - Controls TypeScript declaration bundling
   - Manages type declaration dependencies
   - Configures type definition output

6. `package.json`
   - Defines package name and version
   - Manages dependencies
   - Controls build and test scripts

The build process generates three output files in the `dist` directory:

- `bundle.umd.js`: The bundled JavaScript code that includes all dependencies
- `bundle.d.ts`: The TypeScript declaration file that includes all type dependencies
- `metadata.json`: Auto-generated metadata for assertions, generators, hooks, utilities, and test cases

These files are used by the ReAPI CLI to sync your library to the platform.

## Implementation Guide

> **Important**: Before writing any function code, please read the 'Writing Functions Compatible with ReAPI Platform' (FUNCTIONS.md) document to ensure your functions will work correctly with the ReAPI platform.

### 1. Bundle Name Configuration

The bundle name must be unique across your ReAPI environment. In this template, we use `CustomLib` as the global namespace (you can replace this with your own library name, e.g., `MyAwesomeLib`). This name is used consistently in:

- `rollup.config.js` for bundle configuration
- `index.ts` for global type declarations

### 2. Component Registration Pattern

Components are registered using wrapper functions that attach metadata. The build script automatically scans and generates the registration arrays.

**For function components** (assertions, generators, hooks):

```typescript
import { assertion, valueGenerator, hook } from '../_support/decorators'

// Assertion
export const isInt = assertion(
  { id: 'my-is-int', displayName: 'Is Integer', noOfParams: 1 },
  function isInt(value: number) {
    /* ... */
  }
)

// Value Generator
export const now = valueGenerator(
  { id: 'my-now', displayName: 'Now', noOfParams: 0 },
  function now() {
    return new Date().toISOString()
  }
)

// Hook
export const addAuth = hook(
  { id: 'my-add-auth', type: 'BEFORE_REQUEST' },
  async function addAuth() {
    /* ... */
  }
)
```

**For utility classes** (use decorator):

```typescript
import { Utility } from '../_support/decorators'

@Utility({ id: 'StringUtils', displayName: 'String Utilities' })
export class StringUtils {
  static toUpperCase(str: string) {
    return str.toUpperCase()
  }
}
```

### 3. Export and Type Declaration Pattern

Always follow this pattern when exposing your APIs `src/index.ts`:

```typescript
declare global {
  const CustomLib: {
    YourClass: typeof YourClass
    yourFunction: typeof yourFunction
  }
}
export { YourClass, yourFunction }
```

This pattern ensures both:

- Type information is available in ReAPI's web editor
- Functions/classes are accessible globally in ReAPI scripts via `CustomLib.YourClass`

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

1. **Clone this template**

   ```bash
   git clone https://github.com/ReAPI-com/external-lib-template.git my-reapi-lib
   cd my-reapi-lib
   rm -rf .git  # Start fresh git history
   git init
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Update the bundle name** (`CustomLib`) to your unique identifier in:
   - `reapi.config.json` - the `libName` field
   - `rollup.config.js` - the `output.name` field
   - `src/index.ts` - the global declaration

4. **Configure ReAPI sync** in `reapi.config.json`:

   ```json
   {
     "componentId": "YOUR_COMPONENT_ID_HERE",
     "libName": "MyLibName"
   }
   ```

   Get the `componentId` from the ReAPI platform when you create a new external library component.

5. **Add your code** in `src/`

6. **Build and sync**:

   ```bash
   # Set your API key
   export REAPI_API_KEY="your-api-key"

   # Build and sync to ReAPI
   npm run publish:reapi
   ```

The built library will be available in the `dist/` directory:

- `bundle.umd.js`: Your bundled library (runs in ReAPI)
- `bundle.d.ts`: TypeScript declarations (provides intellisense in ReAPI editor)
- `metadata.json`: Auto-generated component metadata

## Publishing and Deployment

### Option A: Using ReAPI CLI (Recommended) ⭐

The simplest way to publish your library directly to ReAPI:

#### Step 1: Configure `reapi.config.json`

```json
{
  "componentId": "YOUR_COMPONENT_ID_HERE",
  "libName": "CustomLib"
}
```

- `componentId`: Get this from the ReAPI platform when you create a new external library component
- `libName`: Must match the name in `rollup.config.js`

#### Step 2: Set Your API Key

```bash
export REAPI_API_KEY="your-api-key-here"
```

Get your API key from ReAPI platform settings.

#### Step 3: Build and Sync

```bash
# Build and sync in one command
npm run publish:reapi

# Or separately
npm run build
npm run sync
```

That's it! Your library is now live on ReAPI.

#### CLI Options

```bash
# Sync with explicit API key
npx -y @reapi/cli@latest sync --api-key "your-key"

# Dry run (preview without uploading)
npx -y @reapi/cli@latest sync --dry-run

# Force sync even if no changes
npx -y @reapi/cli@latest sync --force

# Sync a specific folder
npx -y @reapi/cli@latest sync ./path/to/lib
```

#### Publishing Updates

Simply run `npm run publish:reapi` again. The CLI uses hash-based caching to skip unchanged builds:

```bash
npm run publish:reapi
# Output: "No changes detected. Already synced."
```

Use `--force` to sync anyway.

---

### Option B: Using npm (Manual)

If you prefer to host on npm and use CDN URLs:

#### Step 1: Create an npm Account (First Time Only)

1. Go to [npmjs.com/signup](https://www.npmjs.com/signup)
2. Fill in your details and verify your email

#### Step 2: Login and Publish

```bash
npm login
npm run build
npm publish --access public
```

#### Step 3: Get CDN URLs

After publishing, use unpkg or jsDelivr:

```
JS:    https://unpkg.com/@your-username/my-lib@1.0.0/dist/bundle.umd.js
Types: https://unpkg.com/@your-username/my-lib@1.0.0/dist/bundle.d.ts
```

#### Step 4: Register in ReAPI

1. Navigate to ReAPI's external library management UI
2. Add your library with the CDN URLs
3. Enable the library
4. Reload the ReAPI web page

---

### Option C: Self-Hosting

Host the built files on your own server:

1. Build: `npm run build`
2. Upload `dist/bundle.umd.js` and `dist/bundle.d.ts` to any publicly accessible server
3. Use your server URLs when registering in ReAPI

Examples: AWS S3, Google Cloud Storage, GitHub Pages, or your own web server.

## Usage in ReAPI Scripts

After deploying your library, you can use it in ReAPI scripts:

```typescript
// Your library is available globally
const result = CustomLib.yourFunction()
const value = CustomLib.yourClass.someFunction()
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
describe('yourFunction', () => {
  it('should work as expected', () => {
    const result = yourFunction()
    expect(result).toBe(expectedValue)
  })
})
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
  const CustomLib: {
    // Manually specify your types here
    YourClass: {
      new (): {
        someMethod(): void
      }
    }
    yourFunction(): string
  }
}

export {}
```
