import { beforeEach, describe, expect, it } from "vitest";
import { isGeoLocation } from "./isGeoLocation";

describe("isGeoLocation", () => {
  let assertionResults: any[] = [];
  const $addAssertionResult = (result: any) => {
    assertionResults.push(result);
  };

  // @ts-ignore
  globalThis.$addAssertionResult = $addAssertionResult;

  beforeEach(() => {
    assertionResults = [];
  });

  it("should return true if the value is a valid geo location", () => {
    const value = { lat: 1, lng: 1 };

    isGeoLocation(value);
    expect(assertionResults.length).toBe(1);
    expect(assertionResults[0].passed).toBe(true);
  });

  it("should return false if the value is not a valid geo location", () => {
    const value = { lat: 1 };
    isGeoLocation(value);
    expect(assertionResults.length).toBe(1);
    expect(assertionResults[0].passed).toBe(false);
  });
});
