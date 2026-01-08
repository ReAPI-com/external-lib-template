import { Utility } from "../_support/decorators";

@Utility({
  id: "StringUtils",
  displayName: "String Utilities",
  description: "String manipulation utilities",
})
export class StringUtils {
  static toUpperCase(str: string) {
    return str.toUpperCase();
  }
}
