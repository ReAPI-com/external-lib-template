import { isIntAssertion } from "./assertion/isInt";
import { dateTimeGeneratorFunctions } from "./generator/dateTime";
import { modifyRequestParamsHook } from "./hook/modifyRequestParams";
import { modifyResponseDataHook } from "./hook/modifyResponseData";
import { dateTimeTransformerFunctions } from "./transformer/dateTime";
import { GeoUtils } from "./utility/GeoUtils";
import { NumberUtils } from "./utility/NumberUtils";
import { StringUtils } from "./utility/StringUtils";

// This is required for type declaration to work on the web editor
declare global {
  const $$CustomLib: {
    GeoUtils: typeof GeoUtils;
    StringUtils: typeof StringUtils;
    NumberUtils: typeof NumberUtils;
  };
}

const $$AssertionFunctions = [isIntAssertion];

const $$ValueFunctions = [
  ...dateTimeGeneratorFunctions,
  ...dateTimeTransformerFunctions,
];

const $$ApiHooks = [modifyRequestParamsHook, modifyResponseDataHook];

export {
  $$ApiHooks,
  $$AssertionFunctions,
  $$ValueFunctions,
  GeoUtils,
  NumberUtils,
  StringUtils
};

