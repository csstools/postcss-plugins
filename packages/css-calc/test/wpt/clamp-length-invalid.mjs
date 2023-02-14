import { convert } from '@csstools/css-calc';
import assert from 'assert';

assert.strictEqual(
	convert('clamp()'),
	'clamp()',
);

assert.strictEqual(
	convert('clamp( )'),
	'clamp( )',
);

assert.strictEqual(
	convert('clamp(,)'),
	'clamp(,)',
);

assert.strictEqual(
	convert('clamp(1px, )'),
	'clamp(1px, )',
);

assert.strictEqual(
	convert('clamp(, 1px)'),
	'clamp(, 1px)',
);

assert.strictEqual(
	convert('clamp(1px, 1px)'),
	'clamp(1px, 1px)',
);

assert.strictEqual(
	convert('clamp(1px, , 1px)'),
	'clamp(1px, , 1px)',
);

assert.strictEqual(
	convert('clamp(, 1px, 1px)'),
	'clamp(, 1px, 1px)',
);

assert.strictEqual(
	convert('clamp(1px, 1px, )'),
	'clamp(1px, 1px, )',
);

assert.strictEqual(
	convert('clamp(1px, 1px, 1px, )'),
	'clamp(1px, 1px, 1px, )',
);

assert.strictEqual(
	convert('clamp(1px 1px 1px)'),
	'clamp(1px 1px 1px)',
);

assert.strictEqual(
	convert('clamp(0, 10rem, 100%)'),
	'clamp(0, 10rem, 100%)',
);

