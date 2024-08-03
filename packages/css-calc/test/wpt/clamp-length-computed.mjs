import { calc } from '@csstools/css-calc';
import assert from 'node:assert';

assert.strictEqual(
	calc('clamp(10px, 20px, 30px)'),
	'20px',
);

assert.strictEqual(
	calc('clamp(10px, 5px, 30px)'),
	'10px',
);

assert.strictEqual(
	calc('clamp(10px, 35px, 30px)'),
	'30px',
);

assert.strictEqual(
	calc('clamp(10px, 35px , 30px)'),
	'30px',
);

assert.strictEqual(
	calc('clamp(10px, 35px /*foo*/, 30px)'),
	'30px',
);

assert.strictEqual(
	calc('clamp(10px /* foo */ , 35px, 30px)'),
	'30px',
);

assert.strictEqual(
	calc('clamp(10px , 35px, 30px)'),
	'30px',
);

assert.strictEqual(
	calc('clamp(30px, 100px, 20px)'),
	'30px',
);

assert.strictEqual(
	calc('clamp(1px, 2px, clamp(2px, 3px, 4px))'),
	'2px',
);
