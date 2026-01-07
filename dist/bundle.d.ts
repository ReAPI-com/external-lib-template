export interface AssertionResult {
	/**
	 * Indicates whether the assertion passed or failed.
	 */
	passed: boolean;
	/**
	 * The actual value obtained during the test.
	 */
	leftValue?: any;
	/**
	 * The expected value to compare against the actual value.
	 */
	rightValue?: any;
	/**
	 * Additional options for the assertion.
	 */
	options?: any;
	/**
	 * A message describing the outcome of the assertion.
	 */
	message?: string;
	/**
	 * Optional metadata related to the assertion.
	 */
	meta?: any;
}
declare global {
	// ============================================================================
	// RESERVED: Component Definition Interfaces
	// These interfaces define the structure of components that ReAPI can discover
	// and execute. The field names are fixed and must not be changed.
	// ============================================================================
	/**
	 * Definition for a custom assertion function.
	 * Assertions validate response data and report pass/fail results.
	 */
	interface AssertionDefinition {
		/** Unique identifier for this assertion (used by ReAPI to invoke it) */
		id: string;
		deprecated?: boolean;
		tested: boolean;
		enabled: boolean;
		/**
		 * Number of parameters the assertion accepts:
		 * - 1: value only, e.g. isTrue(value)
		 * - 2: value + expected, e.g. isEqual(actual, expected)
		 * - 3: value + expected + option, e.g. isCloseTo(actual, expected, delta)
		 */
		noOfParams: 1 | 2 | 3;
		/** The assertion function implementation */
		function: Function;
		displayName?: string;
		description?: string;
	}
	/**
	 * Definition for a custom value generator/transformer.
	 * Value generators produce dynamic values for test data.
	 */
	interface ValueGeneratorDefinition {
		/** Unique identifier for this generator (used by ReAPI to invoke it) */
		id: string;
		deprecated?: boolean;
		tested: boolean;
		enabled: boolean;
		/** The generator function implementation */
		function: Function;
		/** Number of parameters: 0 (no params) or 1 (with options object) */
		noOfParams: 0 | 1;
		displayName?: string;
		description?: string;
	}
	/**
	 * Definition for a custom API hook.
	 * Hooks run before requests or after responses to modify data.
	 */
	interface HookDefinition {
		/** Unique identifier for this hook (used by ReAPI to invoke it) */
		id: string;
		deprecated?: boolean;
		tested: boolean;
		enabled: boolean;
		displayName: string;
		description?: string;
		/** When the hook runs: before sending request or after receiving response */
		type: "beforeRequest" | "afterRequest";
		/** The hook function implementation */
		function: Function;
	}
	interface ApiRequest {
		method: string;
		url: string;
		query: Record<string, any>;
		headers: Record<string, any>;
		body: any;
	}
	interface ApiResponse {
		status: number;
		statusText: string;
		headers: Record<string, any>;
		data?: Record<string, any> | null | undefined;
	}
	type Json = Record<string, any>;
	// Platform-injected globals (keep $ prefix)
	const $request: ApiRequest;
	const $response: ApiResponse;
	const $context: Record<string, any>;
	function $addAssertionResult(result: AssertionResult): void;
	function $setGeneratedValue(value: any): void;
}
/**
 * The value values for the "type" property of GeoJSON Objects.
 * https://tools.ietf.org/html/rfc7946#section-1.4
 */
export type GeoJsonTypes = GeoJSON$1["type"];
/**
 * Bounding box
 * https://tools.ietf.org/html/rfc7946#section-5
 */
export type BBox = [
	number,
	number,
	number,
	number
] | [
	number,
	number,
	number,
	number,
	number,
	number
];
/**
 * A Position is an array of coordinates.
 * https://tools.ietf.org/html/rfc7946#section-3.1.1
 * Array should contain between two and three elements.
 * The previous GeoJSON specification allowed more elements (e.g., which could be used to represent M values),
 * but the current specification only allows X, Y, and (optionally) Z to be defined.
 *
 * Note: the type will not be narrowed down to `[number, number] | [number, number, number]` due to
 * marginal benefits and the large impact of breaking change.
 *
 * See previous discussions on the type narrowing:
 * - {@link https://github.com/DefinitelyTyped/DefinitelyTyped/pull/21590|Nov 2017}
 * - {@link https://github.com/DefinitelyTyped/DefinitelyTyped/discussions/67773|Dec 2023}
 * - {@link https://github.com/DefinitelyTyped/DefinitelyTyped/discussions/71441| Dec 2024}
 *
 * One can use a
 * {@link https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates|user-defined type guard that returns a type predicate}
 * to determine if a position is a 2D or 3D position.
 *
 * @example
 * import type { Position } from 'geojson';
 *
 * type StrictPosition = [x: number, y: number] | [x: number, y: number, z: number]
 *
 * function isStrictPosition(position: Position): position is StrictPosition {
 *   return position.length === 2 || position.length === 3
 * };
 *
 * let position: Position = [-116.91, 45.54];
 *
 * let x: number;
 * let y: number;
 * let z: number | undefined;
 *
 * if (isStrictPosition(position)) {
 *   // `tsc` would throw an error if we tried to destructure a fourth parameter
 * 	 [x, y, z] = position;
 * } else {
 * 	 throw new TypeError("Position is not a 2D or 3D point");
 * }
 */
export type Position = number[];
/**
 * The base GeoJSON object.
 * https://tools.ietf.org/html/rfc7946#section-3
 * The GeoJSON specification also allows foreign members
 * (https://tools.ietf.org/html/rfc7946#section-6.1)
 * Developers should use "&" type in TypeScript or extend the interface
 * to add these foreign members.
 */
export interface GeoJsonObject {
	// Don't include foreign members directly into this type def.
	// in order to preserve type safety.
	// [key: string]: any;
	/**
	 * Specifies the type of GeoJSON object.
	 */
	type: GeoJsonTypes;
	/**
	 * Bounding box of the coordinate range of the object's Geometries, Features, or Feature Collections.
	 * The value of the bbox member is an array of length 2*n where n is the number of dimensions
	 * represented in the contained geometries, with all axes of the most southwesterly point
	 * followed by all axes of the more northeasterly point.
	 * The axes order of a bbox follows the axes order of geometries.
	 * https://tools.ietf.org/html/rfc7946#section-5
	 */
	bbox?: BBox | undefined;
}
type GeoJSON$1<G extends Geometry | null = Geometry, P = GeoJsonProperties> = G | Feature<G, P> | FeatureCollection<G, P>;
/**
 * Geometry object.
 * https://tools.ietf.org/html/rfc7946#section-3
 */
export type Geometry = Point | MultiPoint | LineString | MultiLineString | Polygon | MultiPolygon | GeometryCollection;
/**
 * Point geometry object.
 * https://tools.ietf.org/html/rfc7946#section-3.1.2
 */
export interface Point extends GeoJsonObject {
	type: "Point";
	coordinates: Position;
}
/**
 * MultiPoint geometry object.
 *  https://tools.ietf.org/html/rfc7946#section-3.1.3
 */
export interface MultiPoint extends GeoJsonObject {
	type: "MultiPoint";
	coordinates: Position[];
}
/**
 * LineString geometry object.
 * https://tools.ietf.org/html/rfc7946#section-3.1.4
 */
export interface LineString extends GeoJsonObject {
	type: "LineString";
	coordinates: Position[];
}
/**
 * MultiLineString geometry object.
 * https://tools.ietf.org/html/rfc7946#section-3.1.5
 */
export interface MultiLineString extends GeoJsonObject {
	type: "MultiLineString";
	coordinates: Position[][];
}
/**
 * Polygon geometry object.
 * https://tools.ietf.org/html/rfc7946#section-3.1.6
 */
export interface Polygon extends GeoJsonObject {
	type: "Polygon";
	coordinates: Position[][];
}
/**
 * MultiPolygon geometry object.
 * https://tools.ietf.org/html/rfc7946#section-3.1.7
 */
export interface MultiPolygon extends GeoJsonObject {
	type: "MultiPolygon";
	coordinates: Position[][][];
}
/**
 * Geometry Collection
 * https://tools.ietf.org/html/rfc7946#section-3.1.8
 */
export interface GeometryCollection<G extends Geometry = Geometry> extends GeoJsonObject {
	type: "GeometryCollection";
	geometries: G[];
}
export type GeoJsonProperties = {
	[name: string]: any;
} | null;
/**
 * A feature object which contains a geometry and associated properties.
 * https://tools.ietf.org/html/rfc7946#section-3.2
 */
export interface Feature<G extends Geometry | null = Geometry, P = GeoJsonProperties> extends GeoJsonObject {
	type: "Feature";
	/**
	 * The feature's geometry
	 */
	geometry: G;
	/**
	 * A value that uniquely identifies this feature in a
	 * https://tools.ietf.org/html/rfc7946#section-3.2.
	 */
	id?: string | number | undefined;
	/**
	 * Properties associated with this feature.
	 */
	properties: P;
}
/**
 * A collection of feature objects.
 *  https://tools.ietf.org/html/rfc7946#section-3.3
 */
export interface FeatureCollection<G extends Geometry | null = Geometry, P = GeoJsonProperties> extends GeoJsonObject {
	type: "FeatureCollection";
	features: Array<Feature<G, P>>;
}
/**
 * @module helpers
 */
export type Coord = Feature<Point> | Point | Position;
/**
 * Utility class providing static helper methods for mathematical operations
 * @class
 */
export declare class GeoUtils {
	/**
	 * Generates a random integer between min and max, then subtracts twice the max value
	 * @param {number} min - The minimum value (inclusive)
	 * @param {number} max - The maximum value (inclusive)
	 * @returns {number} A random integer between (min - 2*max) and (max - 2*max)
	 */
	static getRandomInt(min: number, max: number): number;
	/**
	 * Calculates the distance between two coordinates in kilometers
	 * @param {Coord} from - The starting coordinate point
	 * @param {Coord} to - The ending coordinate point
	 * @returns {number} The distance in kilometers between the two points
	 */
	static distance(from: Coord, to: Coord): number;
}
export declare class NumberUtils {
	static isInt(value: number): boolean;
}
export declare class StringUtils {
	static toUpperCase(str: string): string;
}
declare global {
	const CustomLib: {
		GeoUtils: typeof GeoUtils;
		StringUtils: typeof StringUtils;
		NumberUtils: typeof NumberUtils;
		assertions: AssertionDefinition[];
		valueGenerators: ValueGeneratorDefinition[];
		hooks: HookDefinition[];
		getAssertionFunction: (id: string) => Function | undefined;
		getValueFunction: (id: string) => Function | undefined;
		getApiHook: (id: string) => Function | undefined;
	};
}
export declare const assertions: AssertionDefinition[];
export declare const valueGenerators: ValueGeneratorDefinition[];
export declare const hooks: HookDefinition[];
export declare const getAssertionFunction: (id: string) => Function;
export declare const getValueFunction: (id: string) => Function;
export declare const getApiHook: (id: string) => Function;

export {};
