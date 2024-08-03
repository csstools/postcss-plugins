import { calc } from '@csstools/css-calc';
import assert from 'node:assert';

assert.strictEqual(
	calc('log(1)'),
	'0',
);

assert.strictEqual(
	calc('log(10, 10)'),
	'1',
);

assert.strictEqual(
	calc('exp(0)'),
	'1',
);

assert.strictEqual(
	calc('calc(log(e) )'),
	'1',
);

assert.strictEqual(
	calc('calc(e - exp(1))'),
	'0',
);

assert.strictEqual(
	calc('calc(log( 1 + 1 + 2 /2 - 2) )'),
	'0',
);

assert.strictEqual(
	calc('calc(log(1) + exp(0))'),
	'1',
);

assert.strictEqual(
	calc('calc(exp(log(1) + exp(0)*2))', { precision: 1 }),
	'7.4',
);

assert.strictEqual(
	calc('calc(log(log(1) + exp(0)*10))', { precision: 1 }),
	'2.3',
);

assert.strictEqual(
	calc('calc(log(log(1) + exp(0)*20, 10))', { precision: 1 }),
	'1.3',
);

assert.strictEqual(
	calc('calc(log(e)  / log(e) + exp(0)*2 * log(e))'),
	'3',
);

assert.strictEqual(
	calc('calc(log((1 + 1) /2)  / log(e) + exp(0*1)*2 * log(e))'),
	'2',
);

assert.strictEqual(
	calc('calc(log((3 + 1) /2, 2)  / log(e) + exp(0*1)*2 * log(e))'),
	'3',
);

assert.strictEqual(
	calc('calc(log((3 + 1) /2, 2)  / log(e, e) + exp(0*1)*2 * log(e, e))'),
	'3',
);

assert.strictEqual(
	calc('calc(exp(0) + 1)'),
	'2',
);

assert.strictEqual(
	calc('calc(log(exp(1)))'),
	'1',
);

assert.strictEqual(
	calc('calc(log(exp(log(e))))'),
	'1',
);
