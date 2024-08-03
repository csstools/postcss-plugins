import { calc } from '@csstools/css-calc';
import assert from 'node:assert';

assert.strictEqual(
	calc('acos(1)', { toCanonicalUnits: true }),
	'0deg',
);

assert.strictEqual(
	calc('atan(0)', { toCanonicalUnits: true }),
	'0deg',
);

assert.strictEqual(
	calc('asin(0)', { toCanonicalUnits: true }),
	'0deg',
);

assert.strictEqual(
	calc('atan2(0,0)', { toCanonicalUnits: true }),
	'0deg',
);

assert.strictEqual(
	calc('calc(asin(sin(pi/2)))', { toCanonicalUnits: true }),
	'90deg',
);

assert.strictEqual(
	calc('calc(acos(cos(pi - 3.14159265358979323846)))', { toCanonicalUnits: true }),
	'0deg',
);

assert.strictEqual(
	calc('calc(atan(e - 2.7182818284590452354) )', { toCanonicalUnits: true }),
	'0deg',
);

assert.strictEqual(
	calc('calc(asin(sin(30deg + 1.0471967rad ) ))', { toCanonicalUnits: true, precision: 3 }),
	'90deg',
);

assert.strictEqual(
	calc('calc(acos(cos(30deg - 0.523599rad ) ))', { toCanonicalUnits: true, precision: 3 }),
	'0deg',
);

assert.strictEqual(
	calc('calc(asin(sin(3.14159 / 2 + 1 - 1) ))', { toCanonicalUnits: true, precision: 3 }),
	'90deg',
);

assert.strictEqual(
	calc('calc(asin(sin(100grad) ))', { toCanonicalUnits: true }),
	'90deg',
);

assert.strictEqual(
	calc('calc(acos(cos(0 / 2 + 1 - 1) ))', { toCanonicalUnits: true }),
	'0deg',
);

assert.strictEqual(
	calc('calc(atan(tan(30deg + 0.261799rad ) ))', { toCanonicalUnits: true, precision: 3 }),
	'45deg',
);

assert.strictEqual(
	calc('calc(atan(tan(0.7853975rad ) ))', { toCanonicalUnits: true, precision: 3 }),
	'45deg',
);

assert.strictEqual(
	calc('calc(atan(tan(3.14159 / 4 + 1 - 1) ))', { toCanonicalUnits: true, precision: 3 }),
	'45deg',
);

assert.strictEqual(
	calc('calc(asin(sin(0.25turn)) )', { toCanonicalUnits: true }),
	'90deg',
);

assert.strictEqual(
	calc('calc(atan2(0,1))', { toCanonicalUnits: true }),
	'0deg',
);

assert.strictEqual(
	calc('calc(atan2(0,-1))', { toCanonicalUnits: true }),
	'180deg',
);

assert.strictEqual(
	calc('calc(atan2(1,-1))', { toCanonicalUnits: true }),
	'135deg',
);

assert.strictEqual(
	calc('calc(atan2(-1,1))', { toCanonicalUnits: true }),
	'-45deg',
);

assert.strictEqual(
	calc('calc(cos(sin(acos(cos(pi)))))', { toCanonicalUnits: true }),
	'1',
);

assert.strictEqual(
	calc('calc(sin(atan(tan(pi/2))))', { toCanonicalUnits: true }),
	'1',
);

assert.strictEqual(
	calc('atan2(1px, -1px)', { toCanonicalUnits: true }),
	'135deg',
);

assert.strictEqual(
	calc('atan2(1cm, -1cm)', { toCanonicalUnits: true }),
	'135deg',
);

assert.strictEqual(
	calc('atan2(1mm, -1mm)', { toCanonicalUnits: true }),
	'135deg',
);

assert.strictEqual(
	calc('atan2(1Q, -1Q)', { toCanonicalUnits: true }),
	'135deg',
);

assert.strictEqual(
	calc('atan2(1in, -1in)', { toCanonicalUnits: true }),
	'135deg',
);

assert.strictEqual(
	calc('atan2(1pc, -1pc)', { toCanonicalUnits: true }),
	'135deg',
);

assert.strictEqual(
	calc('atan2(1pt, -1pt)', { toCanonicalUnits: true }),
	'135deg',
);

assert.strictEqual(
	calc('atan2(1em, -1em)', { toCanonicalUnits: true }),
	'135deg',
);

assert.strictEqual(
	calc('atan2(1ex, -1ex)', { toCanonicalUnits: true }),
	'135deg',
);

assert.strictEqual(
	calc('atan2(1ch, -1ch)', { toCanonicalUnits: true }),
	'135deg',
);

assert.strictEqual(
	calc('atan2(1rem, -1rem)', { toCanonicalUnits: true }),
	'135deg',
);

assert.strictEqual(
	calc('atan2(1vh, -1vh)', { toCanonicalUnits: true }),
	'135deg',
);

assert.strictEqual(
	calc('atan2(1vw, -1vw)', { toCanonicalUnits: true }),
	'135deg',
);

assert.strictEqual(
	calc('atan2(1deg, -1deg)', { toCanonicalUnits: true }),
	'135deg',
);

assert.strictEqual(
	calc('atan2(1grad, -1grad)', { toCanonicalUnits: true }),
	'135deg',
);

assert.strictEqual(
	calc('atan2(1turn, -1turn)', { toCanonicalUnits: true }),
	'135deg',
);

assert.strictEqual(
	calc('atan2(1rad, -1rad)', { toCanonicalUnits: true }),
	'135deg',
);

assert.strictEqual(
	calc('atan2(1s, -1s)', { toCanonicalUnits: true }),
	'135deg',
);

assert.strictEqual(
	calc('atan2(1ms, -1ms)', { toCanonicalUnits: true }),
	'135deg',
);
