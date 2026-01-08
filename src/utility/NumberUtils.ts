import { isInteger } from "lodash";
import { Utility } from "../_support/decorators";

@Utility({
  id: "NumberUtils",
  displayName: "Number Utilities",
  description: "Number validation and manipulation utilities",
})
export class NumberUtils {
  static isInt(value: number) {
    return isInteger(value);
  }
}
