import { calc } from '@csstools/css-calc';
import assert from 'node:assert';

assert.strictEqual(
	calc('calc(20px + calc(80px))'),
	'100px',
);

assert.strictEqual(
	calc('calc(calc(100px))'),
	'100px',
);

assert.strictEqual(
	calc('calc(calc(2) * calc(50px)'),
	'100px',
);

assert.strictEqual(
	calc('calc(calc(150px*2/3)'),
	'100px',
);

assert.strictEqual(
	calc('calc(calc(2 * calc(calc(3)) + 4) * 10px)'),
	'100px',
);

assert.strictEqual(
	calc('calc(50px + calc(40%))'),
	'calc(50px + 40%)',
);
