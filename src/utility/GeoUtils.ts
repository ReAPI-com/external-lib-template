import { Coord } from "@turf/helpers";
import * as turf from "@turf/turf";

/**
 * Utility class providing static helper methods for mathematical operations
 * @class
 */
export class GeoUtils {
  /**
   * Generates a random integer between min and max, then subtracts twice the max value
   * @param {number} min - The minimum value (inclusive)
   * @param {number} max - The maximum value (inclusive)
   * @returns {number} A random integer between (min - 2*max) and (max - 2*max)
   */
  static getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Calculates the distance between two coordinates in kilometers
   * @param {Coord} from - The starting coordinate point
   * @param {Coord} to - The ending coordinate point
   * @returns {number} The distance in kilometers between the two points
   */
  static distance(from: Coord, to: Coord) {
    return turf.distance(from, to, { units: "kilometers" });
  }
}
