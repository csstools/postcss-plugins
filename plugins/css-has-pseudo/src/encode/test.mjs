import { strict as assert } from 'assert';
import encodeCSS from './encode.mjs';

assert.strictEqual(
	encodeCSS(':has(:focus)'),
	'\\:has\\(\\:focus\\)',
);

assert.strictEqual(
	encodeCSS(':has(~ p)'),
	'\\:has\\(\\~\\%20p\\)',
);

assert.strictEqual(
	encodeCSS(':has(> p)'),
	'\\:has\\(\\%3E\\%20p\\)',
);

assert.strictEqual(
	encodeCSS(':has(+ p)'),
	'\\:has\\(\\%2B\\%20p\\)',
);

assert.strictEqual(
	encodeCSS(':has(\\~ p)'),
	'\\:has\\(\\%5C\\~\\%20p\\)',
);

assert.strictEqual(
	encodeCSS(':has(\\> p)'),
	'\\:has\\(\\%5C\\%3E\\%20p\\)',
);

assert.strictEqual(
	encodeCSS(':has(\\+ p)'),
	'\\:has\\(\\%5C\\%2B\\%20p\\)',
);

assert.strictEqual(
	encodeCSS(':has(\\,\\(\\)\\[\\]\\:\\. p)\\'),
	'\\:has\\(\\%5C\\,\\%5C\\(\\%5C\\)\\%5C\\[\\%5C\\]\\%5C\\:\\%5C\\.\\%20p\\)\\%5C',
);

assert.strictEqual(
	encodeCSS(':has(.esc\\\\\\:aped)'),
	'\\:has\\(\\.esc\\%5C\\%5C\\%5C\\:aped\\)',
);

assert.strictEqual(
	encodeCSS(':has(> [a=":has(.x)"]:hover)'),
	'\\:has\\(\\%3E\\%20\\[a\\%3D\\%22\\:has\\(\\.x\\)\\%22\\]\\:hover\\)',
);

assert.strictEqual(
	encodeCSS(':has(h1, h2, h3, h4, h5, h6)'),
	'\\:has\\(h1\\,\\%20h2\\,\\%20h3\\,\\%20h4\\,\\%20h5\\,\\%20h6\\)',
);

assert.strictEqual(
	encodeCSS(':has(> [\\:has\\(\\%3E\\%20\\.a\\:hover\\)'),
	'\\:has\\(\\%3E\\%20\\[\\%5C\\:has\\%5C\\(\\%5C\\%253E\\%5C\\%2520\\%5C\\.a\\%5C\\:hover\\%5C\\)',
);

assert.strictEqual(
	encodeCSS(':has(\\%perc)'),
	'\\:has\\(\\%5C\\%25perc\\)',
);

assert.strictEqual(
	encodeCSS('foo'),
	'foo',
);
