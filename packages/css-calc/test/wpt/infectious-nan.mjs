import { calc } from '@csstools/css-calc';
import assert from 'node:assert';

// NaN is infectious: any operation or math function with a NaN argument produces NaN.
// https://drafts.csswg.org/css-values-4/#calc-ieee

// calc() arithmetic
{
	assert.strictEqual(
		calc('calc(NaN + 2)'),
		'calc(NaN)',
	);

	assert.strictEqual(
		calc('calc(2 + NaN)'),
		'calc(NaN)',
	);

	assert.strictEqual(
		calc('calc(NaN - 2)'),
		'calc(NaN)',
	);

	assert.strictEqual(
		calc('calc(2 - NaN)'),
		'calc(NaN)',
	);

	assert.strictEqual(
		calc('calc(NaN * 2)'),
		'calc(NaN)',
	);

	assert.strictEqual(
		calc('calc(2 * NaN)'),
		'calc(NaN)',
	);

	assert.strictEqual(
		calc('calc(NaN / 2)'),
		'calc(NaN)',
	);

	assert.strictEqual(
		calc('calc(2 / NaN)'),
		'calc(NaN)',
	);

	assert.strictEqual(
		calc('calc(NaN * 1px)'),
		'calc(NaN * 1px)',
	);

	assert.strictEqual(
		calc('calc(1px * NaN)'),
		'calc(NaN * 1px)',
	);

	assert.strictEqual(
		calc('calc(NaN * 1%)'),
		'calc(NaN * 1%)',
	);

	assert.strictEqual(
		calc('calc(10.135262721212548pc - 199pt / NaN)'),
		'calc(NaN * 1pc)',
	);
}

// min() / max() / clamp()
{
	assert.strictEqual(
		calc('min(NaN, 1)'),
		'calc(NaN)',
	);

	assert.strictEqual(
		calc('min(1, NaN)'),
		'calc(NaN)',
	);

	assert.strictEqual(
		calc('max(NaN, 1)'),
		'calc(NaN)',
	);

	assert.strictEqual(
		calc('max(1, NaN)'),
		'calc(NaN)',
	);

	assert.strictEqual(
		calc('clamp(NaN, 1, 2)'),
		'calc(NaN)',
	);

	assert.strictEqual(
		calc('clamp(1, NaN, 2)'),
		'calc(NaN)',
	);

	assert.strictEqual(
		calc('clamp(1, 2, NaN)'),
		'calc(NaN)',
	);

	assert.strictEqual(
		calc('min(1px, NaN * 1px)'),
		'calc(NaN * 1px)',
	);

	assert.strictEqual(
		calc('max(NaN * 1px, 15px)'),
		'calc(NaN * 1px)',
	);

	assert.strictEqual(
		calc('clamp(1px, NaN * 1px, 2px)'),
		'calc(NaN * 1px)',
	);

	assert.strictEqual(
		calc('max(NaN * 1%, 50%)'),
		'calc(NaN * 1%)',
	);

	assert.strictEqual(
		calc('clamp(NaN * 1%, 1%, 2%)'),
		'calc(NaN * 1%)',
	);

	assert.strictEqual(
		calc('clamp(1%, NaN * 1%, 2%)'),
		'calc(NaN * 1%)',
	);

	assert.strictEqual(
		calc('clamp(1%, 2%, NaN * 1%)'),
		'calc(NaN * 1%)',
	);

	// NaN is infectious even when mixed with infinities.
	// https://drafts.csswg.org/css-values-4/#exponent-infinities
	assert.strictEqual(
		calc('max(infinity, NaN)'),
		'calc(NaN)',
	);

	assert.strictEqual(
		calc('max(NaN, -infinity)'),
		'calc(NaN)',
	);

	assert.strictEqual(
		calc('min(infinity, NaN)'),
		'calc(NaN)',
	);

	assert.strictEqual(
		calc('min(NaN, -infinity)'),
		'calc(NaN)',
	);

	// NaN propagates through nested math functions.
	assert.strictEqual(
		calc('min(max(NaN, 1), 2)'),
		'calc(NaN)',
	);

	assert.strictEqual(
		calc('max(min(NaN, 1), 2)'),
		'calc(NaN)',
	);

	assert.strictEqual(
		calc('clamp(max(NaN, 1), 2, 3)'),
		'calc(NaN)',
	);
}

// round() / mod() / rem()
{
	assert.strictEqual(
		calc('round(NaN, 5)'),
		'calc(NaN)',
	);

	assert.strictEqual(
		calc('round(5, NaN)'),
		'calc(NaN)',
	);

	assert.strictEqual(
		calc('round(up, 5, NaN)'),
		'calc(NaN)',
	);

	assert.strictEqual(
		calc('round(down, NaN, 5)'),
		'calc(NaN)',
	);

	assert.strictEqual(
		calc('round(5px, NaN * 1px)'),
		'calc(NaN * 1px)',
	);

	assert.strictEqual(
		calc('round(NaN * 1px, 5px)'),
		'calc(NaN * 1px)',
	);

	assert.strictEqual(
		calc('round(line-width, NaN * 1px)'),
		'calc(NaN * 1px)',
	);

	assert.strictEqual(
		calc('mod(NaN, 5)'),
		'calc(NaN)',
	);

	assert.strictEqual(
		calc('mod(5, NaN)'),
		'calc(NaN)',
	);

	assert.strictEqual(
		calc('rem(NaN, 5)'),
		'calc(NaN)',
	);

	assert.strictEqual(
		calc('rem(5, NaN)'),
		'calc(NaN)',
	);

	assert.strictEqual(
		calc('mod(5px, NaN * 1px)'),
		'calc(NaN * 1px)',
	);

	assert.strictEqual(
		calc('rem(5px, NaN * 1px)'),
		'calc(NaN * 1px)',
	);

	// NaN is infectious even when the arguments are percentages.
	assert.strictEqual(
		calc('round(NaN * 1%, 5%)'),
		'calc(NaN * 1%)',
	);

	assert.strictEqual(
		calc('round(5%, NaN * 1%)'),
		'calc(NaN * 1%)',
	);

	assert.strictEqual(
		calc('mod(NaN * 1%, 5%)'),
		'calc(NaN * 1%)',
	);

	assert.strictEqual(
		calc('rem(5%, NaN * 1%)'),
		'calc(NaN * 1%)',
	);

	// NaN is infectious even when it would otherwise be masked by the
	// "B is 0" / "both infinite" rules in https://drafts.csswg.org/css-values-4/#round-infinities
	assert.strictEqual(
		calc('round(NaN, 0)'),
		'calc(NaN)',
	);

	assert.strictEqual(
		calc('round(down, NaN, 0)'),
		'calc(NaN)',
	);

	assert.strictEqual(
		calc('mod(NaN, 0)'),
		'calc(NaN)',
	);

	assert.strictEqual(
		calc('rem(NaN, 0)'),
		'calc(NaN)',
	);
}

// abs() / sign()
{
	assert.strictEqual(
		calc('abs(NaN)'),
		'calc(NaN)',
	);

	assert.strictEqual(
		calc('sign(NaN)'),
		'calc(NaN)',
	);

	assert.strictEqual(
		calc('abs(NaN * 1px)'),
		'calc(NaN * 1px)',
	);

	assert.strictEqual(
		calc('sign(NaN * 1px)'),
		'calc(NaN)',
	);

	// NaN is infectious even when the argument is a percentage.
	assert.strictEqual(
		calc('abs(NaN * 1%)'),
		'calc(NaN * 1%)',
	);

	assert.strictEqual(
		calc('sign(NaN * 1%)'),
		'calc(NaN)',
	);

	// NaN is infectious even when produced by a nested calculation.
	assert.strictEqual(
		calc('abs(calc(1px * NaN))'),
		'calc(NaN * 1px)',
	);

	assert.strictEqual(
		calc('sign(calc(NaN + 2))'),
		'calc(NaN)',
	);
}

// trigonometric functions
{
	assert.strictEqual(
		calc('sin(NaN)'),
		'calc(NaN)',
	);

	assert.strictEqual(
		calc('cos(NaN)'),
		'calc(NaN)',
	);

	assert.strictEqual(
		calc('tan(NaN)'),
		'calc(NaN)',
	);

	assert.strictEqual(
		calc('asin(NaN)'),
		'calc(NaN * 1rad)',
	);

	assert.strictEqual(
		calc('acos(NaN)'),
		'calc(NaN * 1rad)',
	);

	assert.strictEqual(
		calc('atan(NaN)'),
		'calc(NaN * 1rad)',
	);

	assert.strictEqual(
		calc('atan2(NaN, 1)'),
		'calc(NaN * 1rad)',
	);

	assert.strictEqual(
		calc('atan2(1, NaN)'),
		'calc(NaN * 1rad)',
	);
}

// exponential functions
{
	assert.strictEqual(
		calc('pow(NaN, 0)'),
		'calc(NaN)',
	);

	assert.strictEqual(
		calc('pow(0, NaN)'),
		'calc(NaN)',
	);

	assert.strictEqual(
		calc('sqrt(NaN)'),
		'calc(NaN)',
	);

	assert.strictEqual(
		calc('exp(NaN)'),
		'calc(NaN)',
	);

	assert.strictEqual(
		calc('hypot(NaN, 1)'),
		'calc(NaN)',
	);

	assert.strictEqual(
		calc('hypot(1, NaN)'),
		'calc(NaN)',
	);

	assert.strictEqual(
		calc('log(NaN)'),
		'calc(NaN)',
	);

	assert.strictEqual(
		calc('log(NaN, 2)'),
		'calc(NaN)',
	);

	assert.strictEqual(
		calc('log(2, NaN)'),
		'calc(NaN)',
	);

	// NaN is infectious even when the arguments are percentages.
	assert.strictEqual(
		calc('hypot(NaN * 1%, 50%)'),
		'calc(NaN * 1%)',
	);

	assert.strictEqual(
		calc('hypot(50%, NaN * 1%)'),
		'calc(NaN * 1%)',
	);

	// hypot() with any infinite input is +infinity, unless NaN is present.
	// https://drafts.csswg.org/css-values-4/#exponent-infinities
	assert.strictEqual(
		calc('hypot(-infinity, 5)'),
		'calc(infinity)',
	);

	assert.strictEqual(
		calc('hypot(5, -infinity)'),
		'calc(infinity)',
	);

	assert.strictEqual(
		calc('hypot(-infinity, -infinity)'),
		'calc(infinity)',
	);

	assert.strictEqual(
		calc('hypot(-infinity, NaN)'),
		'calc(NaN)',
	);

	// pow() with NaN in either argument is NaN, overriding the
	// "B is 0 -> 1" / infinite base rules.
	assert.strictEqual(
		calc('pow(0, NaN)'),
		'calc(NaN)',
	);

	assert.strictEqual(
		calc('pow(infinity, NaN)'),
		'calc(NaN)',
	);

	assert.strictEqual(
		calc('pow(-infinity, NaN)'),
		'calc(NaN)',
	);
}

// calc-mix()
{
	assert.strictEqual(
		calc('calc-mix(NaN)'),
		'calc(NaN)',
	);

	assert.strictEqual(
		calc('calc-mix(NaN 50%, 1 50%)'),
		'calc(NaN)',
	);

	assert.strictEqual(
		calc('calc-mix(1 50%, NaN 50%)'),
		'calc(NaN)',
	);
}

// Percentages that are not NaN must remain unsolved (conservative static analysis).
{
	assert.strictEqual(
		calc('abs(50%)'),
		'abs(50%)',
	);

	assert.strictEqual(
		calc('sign(50%)'),
		'sign(50%)',
	);

	assert.strictEqual(
		calc('round(50%, 10%)'),
		'round(50%, 10%)',
	);

	assert.strictEqual(
		calc('min(50%, 100%)'),
		'min(50%, 100%)',
	);

	assert.strictEqual(
		calc('max(50%, 100%)'),
		'max(50%, 100%)',
	);

	assert.strictEqual(
		calc('hypot(50%, 30%)'),
		'hypot(50%, 30%)',
	);

	assert.strictEqual(
		calc('clamp(0%, 50%, 100%)'),
		'clamp(0%, 50%, 100%)',
	);
}
