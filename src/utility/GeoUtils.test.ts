import { describe, expect, it } from "vitest";
import { GeoUtils } from "./GeoUtils";

describe("GeoUtils", () => {
  it("calculates distance between two coordinates", () => {
    const distance = GeoUtils.distance([0, 0], [1, 1]);
    const roundedDistance = Number(distance.toFixed(4));
    expect(roundedDistance).toBe(157.2496);
  });
});
