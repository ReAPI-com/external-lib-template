// Import auto-generated component registrations
import {
  assertions,
  valueGenerators,
  hooks,
  utilities,
  GeoUtils,
  NumberUtils,
  StringUtils,
  DateTimeUtils,
} from './_generated/registry'

// This is required for type declaration to work on the web editor
declare global {
  const CustomLib: {
    // Your custom utility classes and functions
    GeoUtils: typeof GeoUtils
    StringUtils: typeof StringUtils
    NumberUtils: typeof NumberUtils
    DateTimeUtils: typeof DateTimeUtils

    // ========================================
    // RESERVED: ReAPI Component Registrations
    // ========================================
    // These arrays are scanned by ReAPI to register your components.
    // The naming is fixed and must not be changed.
    assertions: AssertionDefinition[]
    valueGenerators: ValueGeneratorDefinition[]
    hooks: HookDefinition[]
    utilities: UtilityDefinition[]

    // ========================================
    // RESERVED: ReAPI Component Accessors
    // ========================================
    // These functions are called by ReAPI at runtime to invoke your components.
    // The naming is fixed and must not be changed.
    getAssertionFunction: (id: string) => Function | undefined
    getValueFunction: (id: string) => Function | undefined
    getApiHook: (id: string) => Function | undefined
  }
}

// ============================================================================
// RESERVED: Component Accessor Functions
// These functions are called by ReAPI at runtime to invoke your components.
// Do not modify the function signatures.
// ============================================================================
const getAssertionFunction = (id: string) => {
  return assertions.find((fn) => fn.id === id)?.function
}

const getValueFunction = (id: string) => {
  return valueGenerators.find((fn) => fn.id === id)?.function
}

const getApiHook = (id: string) => {
  return hooks.find((fn) => fn.id === id)?.function
}

export {
  assertions,
  valueGenerators,
  hooks,
  utilities,
  GeoUtils,
  NumberUtils,
  StringUtils,
  DateTimeUtils,
  getApiHook,
  getAssertionFunction,
  getValueFunction,
}
