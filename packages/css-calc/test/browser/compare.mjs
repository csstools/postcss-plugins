const NUMBER_RE = /^-?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?$/i;
const PERCENTAGE_RE = /^-?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?%$/i;
const DIMENSION_RE = /^-?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?([a-z]+)$/i;
const NON_FINITE_RE = /^calc\(\s*(-?)(nan|infinity)(?:\s*\*\s*1([a-z]+|%))?\s*\)$/i;

const LENGTH_UNITS = new Set([
	'px', 'cm', 'mm', 'q', 'in', 'pc', 'pt',
	'em', 'rem', 'ex', 'ch', 'lh', 'rlh',
	'vw', 'vh', 'vmin', 'vmax', 'vb', 'vi',
]);

const ANGLE_UNITS = new Set(['deg', 'grad', 'rad', 'turn']);
const TIME_UNITS = new Set(['s', 'ms']);

/**
 * Determine which property to use when observing a css-calc result in a browser.
 *
 * Returns `null` when the result can't be observed (multi-value, unsolved calc,
 * unsupported unit, ...).
 *
 * @param {string} result
 * @returns {{ property: string, kind: string, unit: string } | null}
 */
export function propertyForResult(result) {
	const value = result.trim();

	const nonFinite = value.match(NON_FINITE_RE);
	if (nonFinite) {
		return propertyForUnit(nonFinite[3] ? nonFinite[3].toLowerCase() : '');
	}

	if (PERCENTAGE_RE.test(value)) {
		return propertyForUnit('%');
	}

	if (NUMBER_RE.test(value)) {
		return propertyForUnit('');
	}

	const dimension = value.match(DIMENSION_RE);
	if (!dimension) {
		return null;
	}

	return propertyForUnit(dimension[1].toLowerCase());
}

function propertyForUnit(unit) {
	if (unit === '') {
		return { property: 'scale', kind: 'number', unit };
	}

	if (unit === '%') {
		return { property: 'margin-left', kind: 'percentage', unit };
	}

	if (LENGTH_UNITS.has(unit)) {
		return { property: 'margin-left', kind: 'length', unit };
	}

	if (ANGLE_UNITS.has(unit)) {
		return { property: 'rotate', kind: 'angle', unit };
	}

	if (TIME_UNITS.has(unit)) {
		return { property: 'transition-delay', kind: 'time', unit };
	}

	return null;
}

/**
 * Reduce a number to a given number of significant digits.
 *
 * The browser that computes the value keeps about 6 significant digits (e.g.
 * `calc(1px / 3)` serializes as `0.333333px` and `calc(1e10px / 3)` as
 * `3.33333e+09px`). `css-calc` keeps full double precision.
 *
 * WPT compares computed values with a fuzzy comparison
 * (`assert_array_approx_equals`, see `css/support/color-testcommon.js`), but
 * uses a fixed absolute epsilon. That does not work for values spanning many
 * orders of magnitude, so we reduce both values to the same number of
 * significant digits before comparing instead.
 *
 * @param {number} value
 * @param {number} [significantDigits]
 * @returns {number}
 */
export function reduceToSignificantDigits(value, significantDigits = 6) {
	if (!Number.isFinite(value) || value === 0) {
		return value;
	}

	return Number(value.toPrecision(significantDigits));
}

/**
 * Compare two computed values after accounting for the browser's precision.
 *
 * The browser keeps about 6 significant digits. That means very small values
 * are indistinguishable from `0` there: for example `cos(90deg)` is really
 * `6.12e-17`, but the browser's `rotate` serializes the computed angle as
 * `0deg`. `css-calc` keeps the true value instead.
 *
 * To bridge that gap, values whose magnitude is at most `1e-(significantDigits-1)`
 * are treated as `0` before the significant digit comparison.
 *
 * @param {number} a
 * @param {number} b
 * @param {number} [significantDigits]
 * @returns {boolean}
 */
export function approxEqual(a, b, significantDigits = 6) {
	if (a === b) {
		return true;
	}

	if (Object.is(a, -0) || Object.is(b, -0)) {
		// Zero sign is compared separately.
		return a === 0 && b === 0;
	}

	// Below the browser's precision floor a value is indistinguishable from `0`.
	const floor = Math.pow(10, -(significantDigits - 1));
	const reduce = (value) => reduceToSignificantDigits(Math.abs(value) < floor ? 0 : value, significantDigits);

	return reduce(a) === reduce(b);
}
