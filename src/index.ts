import { isGeoLocationAssertion } from './assertion/isGeoLocation'
import { isIntAssertion } from './assertion/isInt'
import { dateTimeGeneratorFunctions } from './generator/dateTime'
import { modifyRequestParamsHook } from './hook/modifyRequestParams'
import { modifyResponseDataHook } from './hook/modifyResponseData'
import { dateTimeTransformerFunctions } from './transformer/dateTime'
import { GeoUtils } from './utility/GeoUtils'
import { NumberUtils } from './utility/NumberUtils'
import { StringUtils } from './utility/StringUtils'

// This is required for type declaration to work on the web editor
declare global {
  const CustomLib: {
    // Your custom utility classes and functions
    GeoUtils: typeof GeoUtils
    StringUtils: typeof StringUtils
    NumberUtils: typeof NumberUtils

    // ========================================
    // RESERVED: ReAPI Component Registrations
    // ========================================
    // These arrays are scanned by ReAPI to register your components.
    // The naming is fixed and must not be changed.
    assertions: AssertionDefinition[]
    valueGenerators: ValueGeneratorDefinition[]
    hooks: HookDefinition[]

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
// RESERVED: Component Registration Arrays
// These arrays are scanned by ReAPI to discover and register your components.
// Add your custom components to these arrays.
// ============================================================================
const assertions: AssertionDefinition[] = [isIntAssertion, isGeoLocationAssertion]

const valueGenerators: ValueGeneratorDefinition[] = [
  ...dateTimeGeneratorFunctions,
  ...dateTimeTransformerFunctions,
]

const hooks: HookDefinition[] = [modifyRequestParamsHook, modifyResponseDataHook]

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
  GeoUtils,
  getApiHook,
  getAssertionFunction,
  getValueFunction,
  NumberUtils,
  StringUtils,
}
