import { calc } from '@csstools/css-calc';
import assert from 'node:assert';

assert.strictEqual(
	calc('clamp()'),
	'clamp()',
);

assert.strictEqual(
	calc('clamp( )'),
	'clamp( )',
);

assert.strictEqual(
	calc('clamp(,)'),
	'clamp(,)',
);

assert.strictEqual(
	calc('clamp(1px, )'),
	'clamp(1px, )',
);

assert.strictEqual(
	calc('clamp(, 1px)'),
	'clamp(, 1px)',
);

assert.strictEqual(
	calc('clamp(1px, 1px)'),
	'clamp(1px, 1px)',
);

assert.strictEqual(
	calc('clamp(1px, , 1px)'),
	'clamp(1px, , 1px)',
);

assert.strictEqual(
	calc('clamp(, 1px, 1px)'),
	'clamp(, 1px, 1px)',
);

assert.strictEqual(
	calc('clamp(1px, 1px, )'),
	'clamp(1px, 1px, )',
);

assert.strictEqual(
	calc('clamp(1px, 1px, 1px, )'),
	'clamp(1px, 1px, 1px, )',
);

assert.strictEqual(
	calc('clamp(1px 1px 1px)'),
	'clamp(1px 1px 1px)',
);

assert.strictEqual(
	calc('clamp(0, 10rem, 100%)'),
	'clamp(0, 10rem, 100%)',
);
