import { calc } from '@csstools/css-calc';
import assert from 'node:assert';

assert.strictEqual(
	calc('acos(1)', { toCanonicalUnits: true }),
	'0deg',
);

assert.strictEqual(
	calc('acos(-1)', { toCanonicalUnits: true }),
	'180deg',
);

assert.strictEqual(
	calc('acos(-1.5)', { toCanonicalUnits: true }),
	'calc(NaN * 1deg)',
);

assert.strictEqual(
	calc('acos(1.5)', { toCanonicalUnits: true }),
	'calc(NaN * 1deg)',
);

assert.strictEqual(
	calc('acos(2)', { toCanonicalUnits: true }),
	'calc(NaN * 1deg)',
);

assert.strictEqual(
	calc('acos(0.5)', { toCanonicalUnits: true }),
	'60deg',
);

assert.strictEqual(
	calc('acos(1 - 0.5)', { toCanonicalUnits: true }),
	'60deg',
);

assert.strictEqual(
	calc('acos(0)', { toCanonicalUnits: true }),
	'90deg',
);

assert.strictEqual(
	calc('asin(1)', { toCanonicalUnits: true }),
	'90deg',
);

assert.strictEqual(
	calc('asin(-1)', { toCanonicalUnits: true }),
	'-90deg',
);

assert.strictEqual(
	calc('asin(-1.5)', { toCanonicalUnits: true }),
	'calc(NaN * 1deg)',
);

assert.strictEqual(
	calc('asin(1.5)', { toCanonicalUnits: true }),
	'calc(NaN * 1deg)',
);

assert.strictEqual(
	calc('asin(2)', { toCanonicalUnits: true }),
	'calc(NaN * 1deg)',
);

assert.strictEqual(
	calc('asin(0.5)', { toCanonicalUnits: true }),
	'30deg',
);

assert.strictEqual(
	calc('asin(1 - 0.5)', { toCanonicalUnits: true }),
	'30deg',
);

assert.strictEqual(
	calc('asin(0)', { toCanonicalUnits: true }),
	'0deg',
);

assert.strictEqual(
	calc('acos(pi - pi)', { toCanonicalUnits: true }),
	'90deg',
);

assert.strictEqual(
	calc('asin(pi - pi + 1)', { toCanonicalUnits: true }),
	'90deg',
);

assert.strictEqual(
	calc('atan(1)', { toCanonicalUnits: true }),
	'45deg',
);

assert.strictEqual(
	calc('atan(0.5)', { toCanonicalUnits: true, precision: 4 }),
	'26.5651deg',
);

assert.strictEqual(
	calc('atan(0.577350269)', { toCanonicalUnits: true, precision: 4 }),
	'30deg',
);

assert.strictEqual(
	calc('atan(0)', { toCanonicalUnits: true }),
	'0deg',
);

assert.strictEqual(
	calc('atan(infinity)', { toCanonicalUnits: true }),
	'90deg',
);

assert.strictEqual(
	calc('atan(tan(90deg))', { toCanonicalUnits: true }),
	'90deg',
);

assert.strictEqual(
	calc('atan(tan(-90deg))', { toCanonicalUnits: true }),
	'-90deg',
);

assert.strictEqual(
	calc('atan2(37.320508075, 10)', { toCanonicalUnits: true, precision: 4 }),
	'75deg',
);

assert.strictEqual(
	calc('atan2(1s, 1000ms)', { toCanonicalUnits: true }),
	'45deg',
);

assert.strictEqual(
	calc('atan2(infinity, infinity)', { toCanonicalUnits: true }),
	'45deg',
);

assert.strictEqual(
	calc('atan2(-infinity, -infinity)', { toCanonicalUnits: true }),
	'-135deg',
);

assert.strictEqual(
	calc('atan2(infinity, 10)', { toCanonicalUnits: true }),
	'90deg',
);

assert.strictEqual(
	calc('atan2(10, infinity)', { toCanonicalUnits: true }),
	'0deg',
);

assert.strictEqual(
	calc('atan2(NaN, 10)', { toCanonicalUnits: true }),
	'calc(NaN * 1deg)',
);

assert.strictEqual(
	calc('atan2(10, NaN)', { toCanonicalUnits: true }),
	'calc(NaN * 1deg)',
);

assert.strictEqual(
	calc('atan2(NaN, NaN)', { toCanonicalUnits: true }),
	'calc(NaN * 1deg)',
);
