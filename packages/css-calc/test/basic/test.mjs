import { calc } from '@csstools/css-calc';
import { NumberType, TokenType } from '@csstools/css-tokenizer';
import assert from 'assert';

assert.strictEqual(
	calc('calc(10 * 2)'),
	(10 * 2).toString(),
);

assert.strictEqual(
	calc('calc(15 / 5 / 3)'),
	(15 / 5 / 3).toString(),
);

assert.strictEqual(
	calc('calc(15 / (5 / 3))'),
	(15 / (5 / 3)).toString(),
);

assert.strictEqual(
	calc('calc(15 / (3 / 5))'),
	(15 / (3 / 5)).toString(),
);

assert.strictEqual(
	calc('calc(2 * 3 + 7 * 5)'),
	(2 * 3 + 7 * 5).toString(),
);

assert.strictEqual(
	calc('calc(((2 * 3) + 7) * 5)'),
	(((2 * 3) + 7) * 5).toString(),
);

assert.strictEqual(
	calc('foo(something calc(2 * 3 + 7 * 5) something-else)'),
	`foo(something ${(2 * 3 + 7 * 5).toString()} something-else)`,
);

{
	const globals = new Map([
		['r', [TokenType.Number, (3).toString(), -1, -1, { value: 3, type: NumberType.Number }]],
	]);

	assert.strictEqual(
		calc('foo(something calc(2 * r + 7 * 5) something-else)', { globals: globals }),
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
		calc('rgb(from rgb(50 100 150) calc(r * 2) calc(g / 2) calc(b / 3))', { globals: globals }),
		`rgb(from rgb(50 100 150) ${(50 * 2).toString()} ${(100 / 2).toString()} ${(150 / 3).toString()})`,
	);
}

{
	const globals = new Map([
		['r', '50'],
		['g', '100'],
		['b', '150'],
	]);

	assert.strictEqual(
		calc('rgb(from rgb(50 100 150) calc(r * 2) calc(g / 2) calc(b / 3))', { globals: globals }),
		`rgb(from rgb(50 100 150) ${(50 * 2).toString()} ${(100 / 2).toString()} ${(150 / 3).toString()})`,
	);
}

{
	const globals = new Map([
		['a', '50s'],
		['b', '100in'],
		['c', '150q'],
	]);

	assert.strictEqual(
		calc('calc(a * 2) calc(b / 2) calc(c / 3)', { globals: globals }),
		`${(50 * 2).toString()}s ${(100 / 2).toString()}in ${(150 / 3).toString()}q`,
	);
}

{
	const globals = new Map([
		['none', [TokenType.Number, '0', -1, -1, { value: 0, type: NumberType.Number }]],
	]);

	assert.strictEqual(
		calc('calc(none + 0.2)', { globals: globals }),
		'0.2',
	);

	assert.strictEqual(
		calc('calc(none + 0.2)'),
		'calc(none + 0.2)',
	);

	assert.strictEqual(
		calc('clamp(1, 2, none)', { globals: globals }),
		'1',
	);

	assert.strictEqual(
		calc('clamp(1, 2, none)'),
		'2',
	);
}

assert.strictEqual(
	calc('clamp(10, 20, 15)'),
	(15).toString(),
);

assert.strictEqual(
	calc('clamp(100px, 80px, 50px)'),
	'100px',
);

assert.strictEqual(
	calc('clamp(100px, -1px, 50px)'),
	'100px',
);

assert.strictEqual(
	calc('clamp(100px, 101px, 50px)'),
	'100px',
);

assert.strictEqual(
	calc('calc(15 / unknown(5 / 3))'),
	'calc(15 / unknown(5 / 3))',
);

assert.strictEqual(
	calc('calc(1 / 3)', { precision: 1 }),
	'0.3',
);

assert.strictEqual(
	calc('calc(1 / 3)', { precision: 2 }),
	'0.33',
);

assert.strictEqual(
	calc('calc(10hz + 10hz)', { toCanonicalUnits: true }),
	'20hz',
);

assert.strictEqual(
	calc('calc(0.01khz + 10hz)', { toCanonicalUnits: true }),
	'20hz',
);

assert.strictEqual(
	calc('calc(10hz + 0.01khz)', { toCanonicalUnits: true }),
	'20hz',
);

assert.strictEqual(
	calc('calc(10hz + 10hz)', { toCanonicalUnits: false }),
	'20hz',
);

assert.strictEqual(
	calc('calc(0.01khz + 10hz)', { toCanonicalUnits: false }),
	'0.02khz',
);

assert.strictEqual(
	calc('calc(10hz + 0.01khz)', { toCanonicalUnits: false }),
	'20hz',
);

assert.strictEqual(
	calc('sin(90deg)', { toCanonicalUnits: false }),
	'1',
);
