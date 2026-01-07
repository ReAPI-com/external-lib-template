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
    GeoUtils: typeof GeoUtils
    StringUtils: typeof StringUtils
    NumberUtils: typeof NumberUtils

    assertions: AssertionDefinition[]
    valueGenerators: ValueGeneratorDefinition[]
    hooks: HookDefinition[]

    getAssertionFunction: (id: string) => Function | undefined
    getValueFunction: (id: string) => Function | undefined
    getApiHook: (id: string) => Function | undefined
  }
}

const assertions = [isIntAssertion, isGeoLocationAssertion]

const valueGenerators = [...dateTimeGeneratorFunctions, ...dateTimeTransformerFunctions]

const hooks = [modifyRequestParamsHook, modifyResponseDataHook]

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
