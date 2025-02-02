import { NumberUtils } from "src/utility/NumberUtils";

export function isInt(value: any) {
  if (NumberUtils.isInt(value)) {
    $addAssertionResult({
      passed: true,
      leftValue: value,
      message: "The value is an integer",
    });
  } else {
    $addAssertionResult({
      passed: false,
      leftValue: value,
      message: "The value is not an integer",
    });
  }
}

export const isIntAssertion: AssertionFunction = {
  id: "reapi-is-int",
  noOfParams: 1,
  function: isInt,
  enabled: true,
  tested: true,
};
