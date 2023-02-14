import { convert } from '@csstools/css-calc';
import { NumberType, TokenType } from '@csstools/css-tokenizer';
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
	convert('calc(((2 * 3) + 7) * 5)'),
	(((2 * 3) + 7) * 5).toString(),
);

assert.strictEqual(
	convert('foo(something calc(2 * 3 + 7 * 5) something-else)'),
	`foo(something ${(2 * 3 + 7 * 5).toString()} something-else)`,
);

{
	const globals = new Map([
		['r', [TokenType.Number, (3).toString(), -1, -1, { value: 3, type: NumberType.Number }]],
	]);

	assert.strictEqual(
		convert('foo(something calc(2 * r + 7 * 5) something-else)', globals),
		`foo(something ${(2 * 3 + 7 * 5).toString()} something-else)`,
	);
}

{
	const globals = new Map([
		['r', [TokenType.Number, (50).toString(), -1, -1, { value: 50, type: NumberType.Number }]],
		['g', [TokenType.Number, (100).toString(), -1, -1, { value: 100, type: NumberType.Number }]],
		['b', [TokenType.Number, (150).toString(), -1, -1, { value: 150, type: NumberType.Number }]],
	]);

	assert.strictEqual(
		convert('rgb(rgb(50 100 150) calc(r * 2) calc(g / 2) calc(b / 3))', globals),
		`rgb(rgb(50 100 150) ${(50 * 2).toString()} ${(100 / 2).toString()} ${(150 / 3).toString()})`,
	);
}

{
	const globals = new Map([
		['r', '50'],
		['g', '100'],
		['b', '150'],
	]);

	assert.strictEqual(
		convert('rgb(rgb(50 100 150) calc(r * 2) calc(g / 2) calc(b / 3))', globals),
		`rgb(rgb(50 100 150) ${(50 * 2).toString()} ${(100 / 2).toString()} ${(150 / 3).toString()})`,
	);
}

{
	const globals = new Map([
		['a', '50s'],
		['b', '100in'],
		['c', '150q'],
	]);

	assert.strictEqual(
		convert('calc(a * 2) calc(b / 2) calc(c / 3)', globals),
		`${(50 * 2).toString()}s ${(100 / 2).toString()}in ${(150 / 3).toString()}q`,
	);
}

assert.strictEqual(
	convert('clamp(10, 20, 15)'),
	(15).toString(),
);

assert.strictEqual(
	convert('calc(15 / unknown(5 / 3))'),
	'calc(15 / unknown(5 / 3))',
);
