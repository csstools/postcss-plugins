import { featureIsLess } from '../../lib/feature-is-less.mjs';
import { strict as assert } from 'assert';
import { insertAfterKey, insertBeforeKey, insertOrderKey } from '../../own-keys/keys.mjs';

// "featureIsLess" works as a sorting function.
const features = [
	{ id: 'has-pseudo-class', [insertAfterKey]: true, [insertOrderKey]: 1 },
	{ id: 'lab-function', [insertBeforeKey]: true, [insertOrderKey]: 2 },
	{ id: 'has-pseudo-class', [insertAfterKey]: true, [insertOrderKey]: 0 },
	{ id: 'lab-function' },
	{ id: 'lab-function', [insertBeforeKey]: true, [insertOrderKey]: 0 },
	{ id: 'has-pseudo-class' },
	{ id: 'lab-function', [insertBeforeKey]: true, [insertOrderKey]: 1 },
];
features.sort((a, b) => {
	return featureIsLess(a, b);
});

assert.deepStrictEqual(
	features,
	[
		{ id: 'lab-function', [insertBeforeKey]: true, [insertOrderKey]: 0 },
		{ id: 'lab-function', [insertBeforeKey]: true, [insertOrderKey]: 1 },
		{ id: 'lab-function', [insertBeforeKey]: true, [insertOrderKey]: 2 },
		{ id: 'lab-function' },
		{ id: 'has-pseudo-class' },
		{ id: 'has-pseudo-class', [insertAfterKey]: true, [insertOrderKey]: 0 },
		{ id: 'has-pseudo-class', [insertAfterKey]: true, [insertOrderKey]: 1 },
	],
);

// regular features
assert.strictEqual(
	featureIsLess(
		{ id: 'lab-function' },
		{ id: 'has-pseudo-class' },
	),
	-1,
);

assert.strictEqual(
	featureIsLess(
		{ id: 'system-ui-font-family' },
		{ id: 'has-pseudo-class' },
	),
	1,
);

assert.strictEqual(
	featureIsLess(
		{ id: 'has-pseudo-class' },
		{ id: 'has-pseudo-class' },
	),
	0,
);

// inserted features
assert.strictEqual(
	featureIsLess(
		{ id: 'lab-function' },
		{ id: 'lab-function', [insertBeforeKey]: true, [insertOrderKey]: 0 },
	),
	1,
);

assert.strictEqual(
	featureIsLess(
		{ id: 'lab-function', [insertBeforeKey]: true, [insertOrderKey]: 0 },
		{ id: 'lab-function' },
	),
	-1,
);

assert.strictEqual(
	featureIsLess(
		{ id: 'lab-function', [insertBeforeKey]: true, [insertOrderKey]: 0 },
		{ id: 'lab-function', [insertBeforeKey]: true, [insertOrderKey]: 1 },
	),
	-1,
);

assert.strictEqual(
	featureIsLess(
		{ id: 'lab-function', [insertBeforeKey]: true, [insertOrderKey]: 1 },
		{ id: 'lab-function', [insertBeforeKey]: true, [insertOrderKey]: 0 },
	),
	1,
);

assert.strictEqual(
	featureIsLess(
		{ id: 'lab-function' },
		{ id: 'lab-function', [insertAfterKey]: true, [insertOrderKey]: 0 },
	),
	-1,
);

assert.strictEqual(
	featureIsLess(
		{ id: 'lab-function', [insertAfterKey]: true, [insertOrderKey]: 0 },
		{ id: 'lab-function' },
	),
	1,
);

assert.strictEqual(
	featureIsLess(
		{ id: 'lab-function', [insertAfterKey]: true, [insertOrderKey]: 0 },
		{ id: 'lab-function', [insertAfterKey]: true, [insertOrderKey]: 1 },
	),
	-1,
);

assert.strictEqual(
	featureIsLess(
		{ id: 'lab-function', [insertAfterKey]: true, [insertOrderKey]: 1 },
		{ id: 'lab-function', [insertAfterKey]: true, [insertOrderKey]: 0 },
	),
	1,
);
