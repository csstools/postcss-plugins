import type { GlobalsWithStrings } from './util/globals';
export type { GlobalsWithStrings } from './util/globals';

export type conversionOptions = {
	/**
	 * Pass global values as a map of key value pairs.
	 */
	globals?: GlobalsWithStrings,

	/**
	 * The default precision is fairly high.
	 * It aims to be high enough to make rounding unnoticeable in the browser.
	 * You can set it to a lower number to suite your needs.
	 */
	precision?: number,

	/**
	 * By default this package will try to preserve units.
	 * The heuristic to do this is very simplistic.
	 * We take the first unit we encounter and try to convert other dimensions to that unit.
	 *
	 * This better matches what users expect from a CSS dev tool.
	 *
	 * If you want to have outputs that are closes to CSS serialized values you can set `true`.
	 */
	toCanonicalUnits?: boolean,

	/**
	 * Convert NaN, Infinity, ... into standard representable values.
	 */
	censorIntoStandardRepresentableValues?: boolean,

	/**
	 * Some percentages resolve against other values and might be negative or positive depending on context.
	 * Raw percentages are more likely to be safe to simplify outside of a browser context
	 *
	 * @see https://drafts.csswg.org/css-values-4/#calc-simplification
	 */
	rawPercentages?: boolean

	/**
	 * Seed the pseudo random number generator used in `random()`
	 */
	randomSeed?: number
};
