import { convert } from '@csstools/css-calc';
import assert from 'assert';

assert.strictEqual(
	convert('tan(90deg)'),
	'calc(infinity)',
);

assert.strictEqual(
	convert('tan(100grad)'),
	'calc(infinity)',
);

assert.strictEqual(
	convert('tan(270deg)'),
	'calc(infinity)',
);

assert.strictEqual(
	convert('tan(300grad)'),
	'calc(infinity)',
);

assert.strictEqual(
	convert('tan(-270deg)'),
	'calc(-infinity)',
);

assert.strictEqual(
	convert('tan(-100grad)'),
	'calc(-infinity)',
);

assert.strictEqual(
	convert('tan(-450deg)'),
	'calc(-infinity)',
);

assert.strictEqual(
	convert('tan(-300grad)'),
	'calc(-infinity)',
);
