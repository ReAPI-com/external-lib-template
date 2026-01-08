# ReAPI External Library Template

The ReAPI External Library Template is a ready-to-use project designed to empower QA teams by enabling developers to register global utility functions, custom assertion functions, value functions, and API hooks.

With this template, developers can write code just like a standard Node.js project, leveraging any browser-compatible dependencies.

## Quick Overview

Here's the high-level workflow to create and use your own external library:

1. **Clone** - Clone this template repository
2. **Modify** - Add your custom functions, assertions, value generators, and hooks
3. **Build** - Run `npm run build` to generate the bundle
4. **Publish** - Publish to npm, or upload to your own server
5. **Register** - Add the URL to ReAPI and enable the library

Once registered, your library is globally available in all ReAPI scripts!

> **Note:** ReAPI currently only supports **public URLs**. The library files must be accessible without authentication.

## Key Files Overview

Before diving into implementation, familiarize yourself with these essential files:

1. `src/index.ts`
   - Central export file
   - Manages global type declarations and exports
   - Defines the structure of your library's public API

2. `src/_support/global.d.ts`
   - Contains core type declarations
   - Defines global interfaces and types
   - Essential for TypeScript integration

3. `rollup.config.js`
   - Configures bundle generation
   - Defines your library's global namespace (e.g., `CustomLib`)
   - Manages build optimization settings

4. `dts.config.json`
   - Controls TypeScript declaration bundling
   - Manages type declaration dependencies
   - Configures type definition output

5. `package.json`
   - Defines package name and version
   - Manages dependencies
   - Controls build and test scripts

The build process generates two essential output files in the `dist` directory:

- `bundle.umd.js`: The bundled JavaScript code that includes all dependencies
- `bundle.d.ts`: The TypeScript declaration file that includes all type dependencies

These two files are required to deploy your library to the cloud and register it with ReAPI.

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

2. **Configure your package name** in `package.json`:

   ```json
   {
     "name": "@your-npm-username/my-reapi-lib",
     "version": "1.0.0",
     "description": "My custom ReAPI library"
   }
   ```

   > Use your npm username as a scope to ensure uniqueness

3. **Update the bundle name** (`CustomLib`) to your unique identifier in:
   - `rollup.config.js` - the `output.name` field
   - `src/index.ts` - the global declaration
   - `src/_support/global.d.ts` - the global interface

4. **Add your code** in `src/`

5. **Build**:
   ```bash
   npm install
   npm run build
   ```

The built library will be available in the `dist/` directory:

- `bundle.umd.js`: Your bundled library (this is what runs in ReAPI)
- `bundle.d.ts`: TypeScript declarations (provides intellisense in ReAPI editor)

## Publishing and Deployment

### Step 1: Create an npm Account (First Time Only)

If you don't have an npm account, create one:

1. Go to [npmjs.com/signup](https://www.npmjs.com/signup)
2. Fill in your details (username, email, password)
3. Verify your email address

### Step 2: Login to npm

Open your terminal and login:

```bash
npm login
```

You'll be prompted for:

- Username
- Password
- Email (will be public)
- One-time password (if 2FA enabled)

### Step 3: Choose a Unique Package Name

npm package names must be globally unique. Update `package.json`:

```json
{
  "name": "@your-username/my-reapi-lib",
  "version": "1.0.0"
}
```

**Naming options:**

| Format               | Example            | Notes                                                       |
| -------------------- | ------------------ | ----------------------------------------------------------- |
| Scoped (recommended) | `@yourname/my-lib` | Uses your npm username as scope, easier to get unique names |
| Unscoped             | `my-reapi-lib`     | Must be globally unique, harder to find available names     |

**Tips for choosing a name:**

- Use your npm username or organization as a scope: `@yourname/lib-name`
- Add a prefix: `reapi-mycompany-utils`
- Check availability: `npm search your-package-name`

### Step 4: Build Your Library

```bash
npm run build
```

This generates:

- `dist/bundle.umd.js` - The bundled JavaScript
- `dist/bundle.d.ts` - TypeScript declarations

**Only these files will be published** (source code stays private).

### Step 5: Publish to npm

```bash
# For scoped packages (recommended)
npm publish --access public

# For unscoped packages
npm publish
```

**First publish?** You might see:

```
npm ERR! 403 You must verify your email before publishing
```

→ Check your email and verify your npm account.

**Name taken?** You'll see:

```
npm ERR! 403 Package name too similar to existing package
```

→ Choose a different name in `package.json`.

### Step 6: Get Your CDN URLs

After publishing, your library is available via CDN. Wait 1-2 minutes, then use:

**unpkg (recommended):**

```
JS:    https://unpkg.com/@your-username/my-lib@1.0.0/dist/bundle.umd.js
Types: https://unpkg.com/@your-username/my-lib@1.0.0/dist/bundle.d.ts
```

**jsDelivr (alternative):**

```
JS:    https://cdn.jsdelivr.net/npm/@your-username/my-lib@1.0.0/dist/bundle.umd.js
Types: https://cdn.jsdelivr.net/npm/@your-username/my-lib@1.0.0/dist/bundle.d.ts
```

> **Important:** Always use specific version numbers (e.g., `@1.0.0`), not `@latest`.

### Step 7: Register in ReAPI

1. Navigate to ReAPI's external library management UI
2. Add your library with the CDN URLs from Step 6
3. Enable the library
4. **Reload the ReAPI web page** to load the new library

### Publishing Updates

When you make changes:

1. Update the version in `package.json`:
   ```json
   {
     "version": "1.0.1"
   }
   ```
2. Rebuild and publish:

   ```bash
   npm run build
   npm publish --access public
   ```

3. Update the version in your ReAPI library URLs

### What Gets Published?

Only the `dist/` folder is published to npm. Your source code stays private:

```
Published to npm:          NOT published:
├── dist/                  ├── src/           (your source code)
│   ├── bundle.umd.js      ├── node_modules/
│   └── bundle.d.ts        ├── tests/
└── package.json           └── ...
```

### Troubleshooting

| Issue                                  | Solution                               |
| -------------------------------------- | -------------------------------------- |
| "Package name too similar"             | Choose a more unique name, use a scope |
| "You must verify your email"           | Check inbox, click verification link   |
| "Cannot publish over existing version" | Bump version number in package.json    |
| "404 on unpkg"                         | Wait 1-2 minutes for CDN to propagate  |
| "Forbidden - scoped package"           | Add `--access public` flag             |

### Alternative: Self-Hosting

If you prefer not to use npm, you can host the built files on your own server:

1. Build your library: `npm run build`
2. Upload `dist/bundle.umd.js` and `dist/bundle.d.ts` to any publicly accessible server
3. Use your server URLs when registering in ReAPI

Examples of self-hosting options:

- Your own web server (e.g., `https://assets.yourcompany.com/libs/my-lib/bundle.umd.js`)
- Cloud storage with public access (AWS S3, Google Cloud Storage, Azure Blob)
- GitHub Pages
- Any CDN or static file hosting service

> **Requirement:** The URLs must be publicly accessible without authentication.

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
