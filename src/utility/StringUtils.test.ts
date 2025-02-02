import { describe, expect, it } from "vitest";
import { StringUtils } from "./StringUtils";

describe("StringUtils", () => {
  it("should return a random string", () => {
    expect(StringUtils.toUpperCase("hello")).toBe("HELLO");
  });
});
