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

    $$AssertionFunctions: AssertionFunction[];
    $$ValueFunctions: ValueFunction[];
    $$ApiHooks: ApiHook[];

    getAssertionFunction: (id: string) => Function | undefined;
    getValueFunction: (id: string) => Function | undefined;
    getApiHook: (id: string) => Function | undefined;
  };
}

const $$AssertionFunctions = [isIntAssertion];

const $$ValueFunctions = [
  ...dateTimeGeneratorFunctions,
  ...dateTimeTransformerFunctions,
];

const $$ApiHooks = [modifyRequestParamsHook, modifyResponseDataHook];

const getAssertionFunction = (id: string) => {
  return $$AssertionFunctions.find((fn) => fn.id === id)?.function;
};

const getValueFunction = (id: string) => {
  return $$ValueFunctions.find((fn) => fn.id === id)?.function;
};

const getApiHook = (id: string) => {
  return $$ApiHooks.find((fn) => fn.id === id)?.function;
};

export {
  $$ApiHooks,
  $$AssertionFunctions,
  $$ValueFunctions,
  GeoUtils,
  NumberUtils,
  StringUtils,
  getApiHook,
  getAssertionFunction,
  getValueFunction,
};
