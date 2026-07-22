import { calc } from '@csstools/css-calc';
import assert from 'node:assert';

assert.strictEqual(
	calc('random(100px, 500px)', { randomCaching: { documentID: 'a', elementID: 'b', propertyName: 'c', propertyN: 0 } }),
	'494.67561px',
);

assert.strictEqual(
	calc('random(fixed, 100px, 500px)'),
	'random(fixed, 100px, 500px)',
);

assert.strictEqual(
	calc('random(fixed element-shared, 100px, 500px)'),
	'random(fixed element-shared, 100px, 500px)',
);

assert.strictEqual(
	calc('random(fixed -0.5, 100px, 500px)'),
	'random(fixed -0.5, 100px, 500px)',
);

assert.strictEqual(
	calc('random(fixed 1.5, 100px, 500px)'),
	'random(fixed 1.5, 100px, 500px)',
);

assert.strictEqual(
	calc('random(fixed 0.5, 100px, 500px)'),
	'300px',
);

assert.strictEqual(
	calc('random(fixed calc(1 / 2), 100px, 500px)'),
	'300px',
);

assert.strictEqual(
	calc('random(fixed 0, 100px, 500px)'),
	'100px',
);

assert.strictEqual(
	calc('random(fixed 1, 100px, 500px)'),
	'500px',
);

assert.strictEqual(
	calc('random(100px, 500px)', { randomCaching: { documentID: 'a', elementID: 'b', propertyName: 'c', propertyN: 0 } }),
	'494.67561px',
);

assert.strictEqual(
	calc('random(100px, 500px)', { randomCaching: { documentID: 'a', elementID: 'bb', propertyName: 'c', propertyN: 0 } }),
	'494.67561px',
);

// Parse errors
{
	assert.strictEqual(
		calc('random(fixed 0.5 element-shared, 100px, 500px)'),
		'random(fixed 0.5 element-shared, 100px, 500px)',
	);

	assert.strictEqual(
		calc('random(fixed 0.5 element-scoped, 100px, 500px)'),
		'random(fixed 0.5 element-scoped, 100px, 500px)',
	);

	assert.strictEqual(
		calc('random(auto element-scoped, 100px, 500px)'),
		'random(auto element-scoped, 100px, 500px)',
	);

	assert.strictEqual(
		calc('random(element-scoped element-scoped, 100px, 500px)'),
		'random(element-scoped element-scoped, 100px, 500px)',
	);

	assert.strictEqual(
		calc('random(property-scoped property-index-scoped, 100px, 500px)'),
		'random(property-scoped property-index-scoped, 100px, 500px)',
	);

	assert.strictEqual(
		calc('random(--foo --foo, 100px, 500px)'),
		'random(--foo --foo, 100px, 500px)',
	);

	assert.strictEqual(
		calc('random(auto element-scoped, 100px, 500px)', { randomCaching: { documentID: 'a', elementID: 'b', propertyName: 'c', propertyN: 0 } }),
		'random(auto element-scoped, 100px, 500px)',
	);
}

// Auto
{
	assert.strictEqual(
		calc('random(auto, 100px, 500px)', { randomCaching: { documentID: 'a', elementID: 'b', propertyName: 'c', propertyN: 0 } }),
		'389.49727px',
	);

	assert.strictEqual(
		calc('random(auto, 100px, 500px)', { randomCaching: { documentID: 'a', elementID: 'b', propertyName: 'c', propertyN: 1 } }),
		'388.31371px',
	);

	assert.strictEqual(
		calc('random(auto, 100px, 500px)', { randomCaching: { documentID: 'a', elementID: 'bb', propertyName: 'c', propertyN: 0 } }),
		'363.49085px',
	);

	assert.strictEqual(
		calc('random(auto, 100px, 500px)', { randomCaching: { documentID: 'a', elementID: 'b', propertyName: 'cc', propertyN: 0 } }),
		'192.06217px',
	);

	assert.strictEqual(
		calc('random(auto, 100px, 500px)', { randomCaching: { documentID: 'a', elementID: 'bb', propertyName: 'cc', propertyN: 0 } }),
		'221.86057px',
	);
}

// Element scoped
{
	assert.strictEqual(
		calc('random(element-scoped, 100px, 500px)', { randomCaching: { documentID: 'a', elementID: 'b', propertyName: 'c', propertyN: 0 } }),
		'263.31683px',
	);

	assert.strictEqual(
		calc('random(element-scoped, 100px, 500px)', { randomCaching: { documentID: 'a', elementID: 'b', propertyName: 'c', propertyN: 1 } }),
		'263.31683px',
	);

	assert.strictEqual(
		calc('random(element-scoped, 100px, 500px)', { randomCaching: { documentID: 'a', elementID: 'bb', propertyName: 'c', propertyN: 0 } }),
		'101.703px',
	);

	assert.strictEqual(
		calc('random(element-scoped, 100px, 500px)', { randomCaching: { documentID: 'a', elementID: 'b', propertyName: 'cc', propertyN: 0 } }),
		'263.31683px',
	);

	assert.strictEqual(
		calc('random(element-scoped, 100px, 500px)', { randomCaching: { documentID: 'a', elementID: 'bb', propertyName: 'cc', propertyN: 0 } }),
		'101.703px',
	);
}

// Property scoped
{
	assert.strictEqual(
		calc('random(property-scoped, 100px, 500px)', { randomCaching: { documentID: 'a', elementID: 'b', propertyName: 'c', propertyN: 0 } }),
		'354.52062px',
	);

	assert.strictEqual(
		calc('random(property-scoped, 100px, 500px)', { randomCaching: { documentID: 'a', elementID: 'b', propertyName: 'c', propertyN: 1 } }),
		'354.52062px',
	);

	assert.strictEqual(
		calc('random(property-scoped, 100px, 500px)', { randomCaching: { documentID: 'a', elementID: 'bb', propertyName: 'c', propertyN: 0 } }),
		'354.52062px',
	);

	assert.strictEqual(
		calc('random(property-scoped, 100px, 500px)', { randomCaching: { documentID: 'a', elementID: 'b', propertyName: 'cc', propertyN: 0 } }),
		'226.3236px',
	);

	assert.strictEqual(
		calc('random(property-scoped, 100px, 500px)', { randomCaching: { documentID: 'a', elementID: 'bb', propertyName: 'cc', propertyN: 0 } }),
		'226.3236px',
	);
}

// Property Index scoped
{
	assert.strictEqual(
		calc('random(property-index-scoped, 100px, 500px)', { randomCaching: { documentID: 'a', elementID: 'b', propertyName: 'c', propertyN: 0 } }),
		'245.51026px',
	);

	assert.strictEqual(
		calc('random(property-index-scoped, 100px, 500px)', { randomCaching: { documentID: 'a', elementID: 'b', propertyName: 'c', propertyN: 1 } }),
		'245.12969px',
	);

	assert.strictEqual(
		calc('random(property-index-scoped, 100px, 500px)', { randomCaching: { documentID: 'a', elementID: 'bb', propertyName: 'c', propertyN: 0 } }),
		'245.51026px',
	);

	assert.strictEqual(
		calc('random(property-index-scoped, 100px, 500px)', { randomCaching: { documentID: 'a', elementID: 'b', propertyName: 'cc', propertyN: 0 } }),
		'167.2736px',
	);

	assert.strictEqual(
		calc('random(property-index-scoped, 100px, 500px)', { randomCaching: { documentID: 'a', elementID: 'bb', propertyName: 'cc', propertyN: 0 } }),
		'167.2736px',
	);
}

// With an explicit name
{
	assert.strictEqual(
		calc('random(--foo, 100px, 500px)', { randomCaching: { documentID: 'a', elementID: 'b', propertyName: 'c', propertyN: 0 } }),
		'304.6569px',
	);

	assert.strictEqual(
		calc('random(--bar, 100px, 500px)', { randomCaching: { documentID: 'a', elementID: 'b', propertyName: 'c', propertyN: 0 } }),
		'465.28073px',
	);

	assert.strictEqual(
		calc('random(--foo property-index-scoped, 100px, 500px)', { randomCaching: { documentID: 'a', elementID: 'b', propertyName: 'c', propertyN: 0 } }),
		'160.79062px',
	);

	assert.strictEqual(
		calc('random(--bar property-index-scoped, 100px, 500px)', { randomCaching: { documentID: 'a', elementID: 'b', propertyName: 'c', propertyN: 0 } }),
		'100.68779px',
	);
}

assert.strictEqual(
	calc('random(100px, 500px) random(100px, 500px)', { randomCaching: { documentID: 'a', elementID: 'b', propertyName: 'c', propertyN: 0 } }),
	'494.67561px 494.67561px',
);

assert.strictEqual(
	calc('random(--foo, 100px, 500px) random(--foo, 100px, 500px)', { randomCaching: { documentID: 'a', elementID: 'b', propertyName: 'c', propertyN: 0 } }),
	'304.6569px 304.6569px',
);

assert.strictEqual(
	calc('random(calc(80px + 20px), 500px)', { randomCaching: { documentID: 'a', elementID: 'b', propertyName: 'c', propertyN: 0 } }),
	'494.67561px',
);

assert.strictEqual(
	calc('random(80px + 20px, 500px)', { randomCaching: { documentID: 'a', elementID: 'b', propertyName: 'c', propertyN: 0 } }),
	'494.67561px',
);

assert.strictEqual(
	calc('random(calc(50px * 2), 500px)', { randomCaching: { documentID: 'a', elementID: 'b', propertyName: 'c', propertyN: 0 } }),
	'494.67561px',
);

assert.strictEqual(
	calc('random(--foo, 100px, 500px)', { randomCaching: { documentID: 'a', elementID: 'b', propertyName: 'c', propertyN: 0 } }),
	'304.6569px',
);

assert.strictEqual(
	calc('random(--foo, 80px + 20px, 500px)', { randomCaching: { documentID: 'a', elementID: 'b', propertyName: 'c', propertyN: 0 } }),
	'304.6569px',
);

assert.strictEqual(
	calc('random(--bar, 100px, 500px)', { randomCaching: { documentID: 'a', elementID: 'b', propertyName: 'c', propertyN: 0 } }),
	'465.28073px',
);

assert.strictEqual(
	calc('random(99px, 500px)', { randomCaching: { documentID: 'a', elementID: 'b', propertyName: 'c', propertyN: 0 } }),
	'494.6623px',
);

assert.strictEqual(
	calc('random(99, 500px)', { randomCaching: { documentID: 'a', elementID: 'b', propertyName: 'c', propertyN: 0 } }),
	'random(99, 500px)',
);

assert.strictEqual(
	calc('random(100px, 500px, 10px)', { randomCaching: { documentID: 'a', elementID: 'b', propertyName: 'c', propertyN: 0 } }),
	'500px',
);

assert.strictEqual(
	calc('random(100px, 500px, calc(5px * 2))', { randomCaching: { documentID: 'a', elementID: 'b', propertyName: 'c', propertyN: 0 } }),
	'500px',
);

assert.strictEqual(
	calc('random(--foo, 100px, 500px, 5px * 2)', { randomCaching: { documentID: 'a', elementID: 'b', propertyName: 'c', propertyN: 0 } }),
	'300px',
);

assert.strictEqual(
	calc('random(-10px, 20px, 50px)', { randomCaching: { documentID: 'a', elementID: 'b', propertyName: 'c', propertyN: 0 } }),
	'20px',
);

assert.strictEqual(
	calc('random(--foo, -10px, 20px, 50px)', { randomCaching: { documentID: 'a', elementID: 'b', propertyName: 'c', propertyN: 0 } }),
	'20px',
);

assert.strictEqual(
	calc('random(--aaaa, -10px, 20px, 50px)', { randomCaching: { documentID: 'a', elementID: 'b', propertyName: 'c', propertyN: 0 } }),
	'-10px',
);

assert.strictEqual(
	calc('random(-10px, 60px, 50px)', { randomCaching: { documentID: 'a', elementID: 'b', propertyName: 'c', propertyN: 0 } }),
	'40px',
);

assert.strictEqual(
	calc('random(--foo, -10px, 60px, 50px)', { randomCaching: { documentID: 'a', elementID: 'b', propertyName: 'c', propertyN: 0 } }),
	'40px',
);

assert.strictEqual(
	calc('random(--aaaa, -10px, 60px, 50px)', { randomCaching: { documentID: 'a', elementID: 'b', propertyName: 'c', propertyN: 0 } }),
	'-10px',
);

assert.strictEqual(
	calc('random(-10px, 20px, -50px)', { randomCaching: { documentID: 'a', elementID: 'b', propertyName: 'c', propertyN: 0 } }),
	'19.60067px',
);

assert.strictEqual(
	calc('random(-10px, 20px, 0px)', { randomCaching: { documentID: 'a', elementID: 'b', propertyName: 'c', propertyN: 0 } }),
	'19.60067px',
);

assert.strictEqual(
	calc('random(-10px, 20px, calc(10px * infinity))', { randomCaching: { documentID: 'a', elementID: 'b', propertyName: 'c', propertyN: 0 } }),
	'-10px',
);

assert.strictEqual(
	calc('random(-10px, 20px, (1px / 0))', { randomCaching: { documentID: 'a', elementID: 'b', propertyName: 'c', propertyN: 0 } }),
	'-10px',
);

assert.strictEqual(
	calc('random(calc(10px * infinity), 20px)', { randomCaching: { documentID: 'a', elementID: 'b', propertyName: 'c', propertyN: 0 } }),
	'calc(NaN * 1px)',
);

assert.strictEqual(
	calc('random(-10px, calc(10px * infinity))', { randomCaching: { documentID: 'a', elementID: 'b', propertyName: 'c', propertyN: 0 } }),
	'calc(NaN * 1px)',
);

assert.strictEqual(
	calc('random(10ms, 1s)', { randomCaching: { documentID: 'a', elementID: 'b', propertyName: 'c', propertyN: 0 } }),
	'986.82213ms',
);

assert.strictEqual(
	calc('random(10deg, 10px)', { randomCaching: { documentID: 'a', elementID: 'b', propertyName: 'c', propertyN: 0 } }),
	'random(10deg, 10px)',
);

assert.strictEqual(
	calc('random(0%, 100%)', { randomCaching: { documentID: 'a', elementID: 'b', propertyName: 'c', propertyN: 0 } }),
	'98.6689%',
);

assert.strictEqual(
	calc('random(0deg, 360deg)', { randomCaching: { documentID: 'a', elementID: 'b', propertyName: 'c', propertyN: 0 } }),
	'355.20805deg',
);

assert.strictEqual(
	calc('random(--foo, 10, 20, -2)', { randomCaching: { documentID: 'a', elementID: 'b', propertyName: 'c', propertyN: 0 } }),
	'15.11642',
);

assert.strictEqual(
	calc('random(10, 20, 0.00005)', { randomCaching: { documentID: 'a', elementID: 'b', propertyName: 'c', propertyN: 0 } }), // Number of steps is small enough
	'19.8669',
);

assert.strictEqual(
	calc('random(10, 20, 0.000005)', { randomCaching: { documentID: 'a', elementID: 'b', propertyName: 'c', propertyN: 0 } }), // Number of steps is small enough
	'19.86689',
);

assert.strictEqual(
	calc('random(0, 1, 0.00000000005)', { randomCaching: { documentID: 'a', elementID: 'b', propertyName: 'c', propertyN: 0 } }), // Number of steps is too large
	'0.98669',
);

assert.strictEqual(
	calc('random(0, 10000000, 0.00000000005)', { randomCaching: { documentID: 'a', elementID: 'b', propertyName: 'c', propertyN: 0 } }), // Number of steps is too large
	'9866890.20647',
);

assert.strictEqual(
	calc('random(--aaa, 0.2, 0.3, 0.1)', { randomCaching: { documentID: 'a', elementID: 'b', propertyName: 'c', propertyN: 0 } }), // Number of steps is too large
	'0.3',
);

for (let i = 0; i < 100; i++) {
	const result = Number(calc(`random(--a${i}, 0, 0.3, 0.1)`, { randomCaching: { documentID: 'a', elementID: 'b', propertyName: 'c', propertyN: 0 } }));

	assert.ok(result >= 0);
	assert.ok(result <= 0.3);
	assert.ok(result === 0 || result === 0.1 || result === 0.2 || result === 0.3);
}

for (let i = 0; i < 100; i++) {
	const result = Number(calc(`random(--a${i}, 0.2, 0.4, 0.1)`, { randomCaching: { documentID: 'a', elementID: 'b', propertyName: 'c', propertyN: 0 } }));

	assert.ok(result >= 0.2);
	assert.ok(result <= 0.4);
	assert.ok(result === 0.2 || result === 0.3 || result === 0.4);
}

assert.strictEqual(
	calc('random(--aaa, 0, 1.8, 0.6)', { randomCaching: { documentID: 'a', elementID: 'b', propertyName: 'c', propertyN: 0 } }),
	'1.8',
);

for (let i = 0; i < 100; i++) {
	const result = Number(calc(`random(--a${i}, 0, 1.8, 0.6)`, { randomCaching: { documentID: 'a', elementID: 'b', propertyName: 'c', propertyN: 0 } }));

	assert.ok(result >= 0);
	assert.ok(result <= 1.8);
	assert.ok(result === 0 || result === 0.6 || result === 1.2 || result === 1.8);
}

for (let i = 0; i < 100; i++) {
	const result = Number(calc(`random(--a${i}, 100, 200, 30)`, { randomCaching: { documentID: 'a', elementID: 'b', propertyName: 'c', propertyN: 0 } }));

	assert.ok(result >= 100);
	assert.ok(result <= 190);
	assert.ok(result === 100 || result === 130 || result === 160 || result === 190);
}
