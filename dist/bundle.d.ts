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
	interface AssertionFunction {
		id: string;
		deprecated?: boolean;
		tested: boolean;
		enabled: boolean;
		noOfParams: number; // only 1, 2
		function: Function;
		displayName?: string;
		description?: string;
	}
	interface ValueFunction {
		id: string;
		deprecated?: boolean;
		tested: boolean;
		enabled: boolean;
		function: Function;
		displayName?: string;
		description?: string;
	}
	interface ApiHook {
		id: string;
		deprecated?: boolean;
		tested: boolean;
		enabled: boolean;
		displayName: string;
		description?: string;
		type: "beforeRequest" | "afterRequest";
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
 */
export type Position = number[]; // [number, number] | [number, number, number];
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
	const $$CustomLib: {
		GeoUtils: typeof GeoUtils;
		StringUtils: typeof StringUtils;
		NumberUtils: typeof NumberUtils;
		$$AssertionFunctions: AssertionFunction[];
		$$ValueFunctions: ValueFunction[];
		$$ApiHooks: ApiHook[];
		getAssertionFunction: (id: string) => Function | undefined;
		getValueFunction: (id: string) => Function | undefined;
		getApiHook: (id: string) => Function | undefined;
	};
}
export declare const $$AssertionFunctions: AssertionFunction[];
export declare const $$ValueFunctions: ValueFunction[];
export declare const $$ApiHooks: ApiHook[];
export declare const getAssertionFunction: (id: string) => Function;
export declare const getValueFunction: (id: string) => Function;
export declare const getApiHook: (id: string) => Function;

export {};
