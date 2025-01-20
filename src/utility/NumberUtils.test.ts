import { describe, expect, it } from "vitest";
import { NumberUtils } from "./NumberUtils";

describe("NumberUtils", () => {
  it("should return true if the value is an integer", () => {
    expect(NumberUtils.isInt(1)).toBe(true);
  });

  it("should return false if the value is not an integer", () => {
    expect(NumberUtils.isInt(1.1)).toBe(false);
    expect(NumberUtils.isInt("1" as any)).toBe(false);
  });
});
