import { Coord } from '@turf/helpers';

interface AssertionResult {
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
		type: "BEFORE_REQUEST" | "AFTER_RESPONSE";
		/** The hook function implementation */
		function: Function;
	}
	/**
	 * Definition for a utility class.
	 * Utilities provide helper methods that can be used in scripts.
	 */
	interface UtilityDefinition {
		/** Unique identifier for this utility (typically the class name) */
		id: string;
		/** Display name shown in the UI */
		displayName?: string;
		/** Description of the utility */
		description?: string;
		/** The class name */
		className: string;
		/** List of static method names available on this utility */
		methods: string[];
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
export declare class StringUtils {
	static toUpperCase(str: string): string;
}
export declare class NumberUtils {
	static isInt(value: number): boolean;
}
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
export declare class DateTimeUtils {
	static formatDateTime(date: Date): string;
	static dateTimeFromTimestamp(timestamp: number): string;
}
export declare const assertions: AssertionDefinition[];
export declare const valueGenerators: ValueGeneratorDefinition[];
export declare const hooks: HookDefinition[];
export declare const utilities: UtilityDefinition[];
declare global {
	const CustomLib: {
		GeoUtils: typeof GeoUtils;
		StringUtils: typeof StringUtils;
		NumberUtils: typeof NumberUtils;
		DateTimeUtils: typeof DateTimeUtils;
		assertions: AssertionDefinition[];
		valueGenerators: ValueGeneratorDefinition[];
		hooks: HookDefinition[];
		utilities: UtilityDefinition[];
		getAssertionFunction: (id: string) => Function | undefined;
		getValueFunction: (id: string) => Function | undefined;
		getApiHook: (id: string) => Function | undefined;
	};
}
export declare const getAssertionFunction: (id: string) => Function;
export declare const getValueFunction: (id: string) => Function;
export declare const getApiHook: (id: string) => Function;

export {};
