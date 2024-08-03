import { calc } from '@csstools/css-calc';
import assert from 'node:assert';

assert.strictEqual(
	calc('cos(0)'),
	'1',
);

assert.strictEqual(
	calc('sin(0)'),
	'0',
);

assert.strictEqual(
	calc('tan(0)'),
	'0',
);

assert.strictEqual(
	calc('calc(sin(pi/2 - pi/2) )'),
	'0',
);

assert.strictEqual(
	calc('calc(cos(pi - 3.14159265358979323846) )'),
	'1',
);

assert.strictEqual(
	calc('calc(cos(e - 2.7182818284590452354) )'),
	'1',
);

assert.strictEqual(
	calc('calc(sin(30deg + 1.0471967rad ) )'),
	'0.9999999999996',
);

assert.strictEqual(
	calc('calc(cos(30deg - 0.523599rad ) )'),
	'1',
);

assert.strictEqual(
	calc('calc(sin(3.14159265359 / 2 + 1 - 1) )'),
	'1',
);

assert.strictEqual(
	calc('calc(sin(100grad) )'),
	'1',
);

assert.strictEqual(
	calc('calc(cos(0 / 2 + 1 - 1) )'),
	'1',
);

assert.strictEqual(
	calc('calc(tan(30deg + 0.261799rad ) )'),
	'0.999999224402',
);

assert.strictEqual(
	calc('calc(tan(0.7853975rad ) )'),
	'0.999998673206',
);

assert.strictEqual(
	calc('calc(tan(3.141592653589793 / 4 + 1 - 1) )'),
	'1',
);

assert.strictEqual(
	calc('calc(sin(0.25turn) )'),
	'1',
);

assert.strictEqual(
	calc('calc(cos(sin(cos(pi) + 1)))'),
	'1',
);

assert.strictEqual(
	calc('calc(sin(tan(pi/4)*pi/2) )'),
	'1',
);
