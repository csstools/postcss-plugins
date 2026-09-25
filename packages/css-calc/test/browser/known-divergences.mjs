/**
 * Some browsers do not (yet) implement every algebraically valid operation.
 *
 * `css-calc` is a static analyser and is not tied to a specific browser build,
 * so it can legitimately differ from the browser used to run these tests.
 *
 * Every entry below is a documented divergence between `css-calc` and the
 * browser, verified by hand. They are reported so they can be reviewed when the
 * browser changes, but they don't fail the suite.
 *
 * Note that most of them share a single root cause: the browser rounds numbers
 * to a much lower precision (about 6 significant digits and in some cases to
 * `float`), while `css-calc` keeps full double precision. Which expressions are
 * affected depends on the fuzzer seed and the browser build.
 *
 * `NaN`/`infinity`-ness itself is compared with the `expr * 0 + 1` probe (see
 * `observeNaN` in `_browser.html`), so only real differences remain here.
 *
 * Each entry:
 * - `expression`: the original expression
 * - `result`: the `css-calc` result
 * - `reason`: why the browser disagrees
 */
export const knownBrowserDivergences = [
	{
		expression: 'pow(NaN, 0)',
		result: 'calc(NaN)',
		reason: 'https://drafts.csswg.org/css-values-4/#exponent-infinities specifies pow(NaN, 0) is NaN. The browser returns 1.',
	},
	{
		expression: 'pow(1, NaN)',
		result: 'calc(NaN)',
		reason: 'https://drafts.csswg.org/css-values-4/#exponent-infinities specifies pow(1, NaN) is NaN. The browser returns 1.',
	},
	{
		expression: 'calc(rem(atan2(3753, log(122.014081, 0)), 3362.706759rad))',
		result: 'calc(NaN * 1deg)',
		reason: 'NaN is infectious, so the second argument of rem() is NaN. The browser rounds `log(122.014081, 0)` and returns a finite angle instead.',
	},
	{
		expression: 'pow(1, infinity)',
		result: 'calc(NaN)',
		reason: 'https://drafts.csswg.org/css-values-4/#exponent-infinities specifies pow(1, infinity) is NaN. The browser returns 1 (matching JS Math.pow instead of CSS).',
	},
	{
		expression: 'pow(-1, infinity)',
		result: 'calc(NaN)',
		reason: 'https://drafts.csswg.org/css-values-4/#exponent-infinities specifies pow(-1, infinity) is NaN. The browser returns 1 (matching JS Math.pow instead of CSS).',
	},
	{
		expression: 'round(NaN, infinity)',
		result: 'calc(NaN)',
		reason: 'NaN is infectious in every math function, so round(NaN, infinity) is NaN. The browser treats the NaN argument as 0 and returns 0.',
	},
	{
		expression: 'calc(clamp(pi, round(to-zero, (-100 - -infinity), (NaN - 5)), min((8308 * -2452), e)))',
		result: 'calc(NaN)',
		reason: '`NaN - 5` is NaN, so `round(to-zero, -infinity, NaN)` is NaN and clamp() is NaN. The browser computes `round(to-zero, -infinity, NaN)` as 0 instead and returns `3.14159` (pi).',
	},
	{
		expression: 'calc(exp( round(to-zero, mod(NaN, infinity), pow(1499.588709, 2003.261459)) ))',
		result: 'calc(NaN)',
		reason: '`mod(NaN, infinity)` is NaN, so `round(to-zero, NaN, ...)` is NaN and `exp(NaN)` is NaN. The browser computes `round(to-zero, NaN, ...)` as 0 instead and returns `1`.',
	},
];

/**
 * `-0` and `0` are different values that serialize identically.
 *
 * Browsers compute the sign of a zero result of trig functions by evaluating
 * the angle, while the spec says the sign follows the sign of the input:
 * https://drafts.csswg.org/css-values-4/#trig-funcs
 * "If the value is 0⁻, the result is 0⁻. Otherwise, the result is 0⁺."
 *
 * These are tracked separately because they are only observable through the
 * sign of the zero, which the tests probe with `1 / sign(...)`.
 * A prefix match is used because any expression that multiplies the zero can
 * inherit the different sign.
 */
export const knownBrowserZeroSignDivergences = [
	{
		prefix: 'sin(-0',
		reason: 'the browser computes +0 for sin(0⁻); the spec says the result is 0⁻.',
	},
	{
		prefix: 'tan(-0',
		reason: 'the browser computes +0 for tan(0⁻); the spec says the result is 0⁻.',
	},
];

/**
 * Expressions where the browser's lower precision changes the value itself
 * (not its `NaN`/`infinity`-ness). The `css-calc` result is the spec-correct
 * one; the browser's approximation is the difference.
 *
 * These are snapshots of fuzzer-found expressions. When the fuzzer seed or the
 * curated corpus changes, this list needs to be regenerated.
 *
 * Each entry documents the observed values so the divergence can be reviewed
 * when the browser changes:
 * - `expression`: the original expression
 * - `config`: the `css-calc` options under which the divergence occurs
 * - `property`: the browser property used to observe the value
 * - `cssCalc`: the `css-calc` result (spec-correct, full double precision)
 * - `browser`: the browser's computed value for the original expression
 *   (lower precision); the browser also computes the `css-calc` result with
 *   the same lower precision, so the two differ by a rounding step.
 */
export const knownBrowserPrecisionDivergences = [
	{
		expression: 'calc(0.001mm)',
		config: 'canonical-units',
		property: 'margin-left',
		cssCalc: '0.0037795275591px',
		browser: '0.00377953px',
	},
	{
		expression: 'calc(0.001Q)',
		config: 'canonical-units',
		property: 'margin-left',
		cssCalc: '0.0009448818898px',
		browser: '0.000944882px',
	},
	{
		expression: 'calc(mod(8579turn, rem(3185rad, min(1e3rad, 3deg))))',
		config: 'canonical-units',
		property: 'rotate',
		cssCalc: '0.0427197123433deg',
		browser: '0.0430437deg',
	},
];

/**
 * Returns a stable key identifying which documented divergence suppresses a
 * failure, or `null` when the failure is not documented.
 *
 * @param {{ expression: string, result: string }} caseItem
 * @param {string} failure
 * @returns {string | null}
 */
export function knownDivergenceKey(caseItem, failure) {
	const value = knownBrowserDivergences.find((divergence) => {
		return divergence.expression === caseItem.expression && divergence.result === caseItem.result;
	});
	if (value) {
		return `value:${value.expression}=>${value.result}`;
	}

	if (failure.includes('to have the same zero sign')) {
		const zeroSign = knownBrowserZeroSignDivergences.find((divergence) => {
			return caseItem.expression.includes(divergence.prefix);
		});
		if (zeroSign) {
			return `zero-sign:${zeroSign.prefix}`;
		}
	}

	const precision = knownBrowserPrecisionDivergences.find((divergence) => {
		return divergence.expression === caseItem.expression && divergence.config === caseItem.config;
	});
	if (precision) {
		return `precision:${precision.expression}`;
	}

	return null;
}

/**
 * Every documented divergence should still be needed. This keeps the allowlist
 * honest: if a browser fixes something (or a fuzzer change removes the case),
 * the stale entry has to be removed.
 *
 * @param {Set<string>} usedDivergenceKeys
 * @returns {Array<string>}
 */
export function knownDivergencesThatNoLongerOccur(usedDivergenceKeys) {
	const all = [
		...knownBrowserDivergences.map((divergence) => `value:${divergence.expression}=>${divergence.result}`),
		...knownBrowserZeroSignDivergences.map((divergence) => `zero-sign:${divergence.prefix}`),
		...knownBrowserPrecisionDivergences.map((divergence) => `precision:${divergence.expression}`),
	];

	return all.filter((key) => !usedDivergenceKeys.has(key));
}
