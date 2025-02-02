import { isInteger } from "lodash";

export class NumberUtils {
  static isInt(value: number) {
    return isInteger(value);
  }
}
