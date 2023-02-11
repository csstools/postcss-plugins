import { convert } from '@csstools/css-calc';
import assert from 'assert';

assert.strictEqual(
	convert('calc(10 * 2)'),
	(10 * 2).toString(),
);

assert.strictEqual(
	convert('calc(15 / 5 / 3)'),
	(15 / 5 / 3).toString(),
);

assert.strictEqual(
	convert('calc(15 / (5 / 3))'),
	(15 / (5 / 3)).toString(),
);

assert.strictEqual(
	convert('calc(15 / (3 / 5))'),
	(15 / (3 / 5)).toString(),
);

assert.strictEqual(
	convert('calc(2 * 3 + 7 * 5)'),
	(2 * 3 + 7 * 5).toString(),
);

assert.strictEqual(
	convert('foo(something calc(2 * 3 + 7 * 5) something-else)'),
	`foo(something ${(2 * 3 + 7 * 5).toString()} something-else)`,
);

assert.strictEqual(
	convert('foo(something calc(2 * r + 7 * 5) something-else)', new Map([['r', 3]])),
	`foo(something ${(2 * 3 + 7 * 5).toString()} something-else)`,
);

assert.strictEqual(
	convert('rgb(rgb(50 100 150) calc(r * 2) calc(g / 2) calc(b / 3))', new Map([['r', 50], ['g', 100], ['b', 150]])),
	`rgb(rgb(50 100 150) ${(50 * 2).toString()} ${(100 / 2).toString()} ${(150 / 3).toString()})`,
);
