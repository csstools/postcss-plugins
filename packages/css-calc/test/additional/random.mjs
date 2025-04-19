import { calc } from '@csstools/css-calc';
import assert from 'node:assert';

assert.strictEqual(
	calc('random(100px, 500px)', { randomCaching: { documentID: 'a', elementID: 'b', propertyName: 'c', propertyN: 0 } }),
	'475.54613px',
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
	calc('random(fixed 0.5 element-shared, 100px, 500px)'),
	'random(fixed 0.5 element-shared, 100px, 500px)',
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
	calc('random(auto, 100px, 500px)', { randomCaching: { documentID: 'a', elementID: 'b', propertyName: 'c', propertyN: 0 } }),
	'475.54613px',
);

assert.strictEqual(
	calc('random(auto, 100px, 500px)', { randomCaching: { documentID: 'a', elementID: 'bb', propertyName: 'c', propertyN: 0 } }),
	'125.44077px',
);

assert.strictEqual(
	calc('random(auto element-shared, 100px, 500px)', { randomCaching: { documentID: 'a', elementID: 'b', propertyName: 'c', propertyN: 0 } }),
	'182.79634px',
);

assert.strictEqual(
	calc('random(auto element-shared, 100px, 500px)', { randomCaching: { documentID: 'a', elementID: 'bb', propertyName: 'c', propertyN: 0 } }),
	'182.79634px',
);

assert.strictEqual(
	calc('random(--foo, 100px, 500px)', { randomCaching: { documentID: 'a', elementID: 'b', propertyName: 'c', propertyN: 0 } }),
	'319.55825px',
);

assert.strictEqual(
	calc('random(--foo element-shared, 100px, 500px)', { randomCaching: { documentID: 'a', elementID: 'b', propertyName: 'c', propertyN: 0 } }),
	'182.8387px',
);

assert.strictEqual(
	calc('random(element-shared --foo, 100px, 500px)', { randomCaching: { documentID: 'a', elementID: 'b', propertyName: 'c', propertyN: 0 } }),
	'182.8387px',
);

assert.strictEqual(
	calc('random(element-shared auto, 100px, 500px)', { randomCaching: { documentID: 'a', elementID: 'b', propertyName: 'c', propertyN: 0 } }),
	'182.79634px',
);

assert.strictEqual(
	calc('random(100px, 500px) random(100px, 500px)', { randomCaching: { documentID: 'a', elementID: 'b', propertyName: 'c', propertyN: 0 } }),
	'475.54613px 420.66239px',
);

assert.strictEqual(
	calc('random(--foo, 100px, 500px) random(--foo, 100px, 500px)', { randomCaching: { documentID: 'a', elementID: 'b', propertyName: 'c', propertyN: 0 } }),
	'319.55825px 319.55825px',
);

assert.strictEqual(
	calc('random(calc(80px + 20px), 500px)', { randomCaching: { documentID: 'a', elementID: 'b', propertyName: 'c', propertyN: 0 } }),
	'475.54613px',
);

assert.strictEqual(
	calc('random(80px + 20px, 500px)', { randomCaching: { documentID: 'a', elementID: 'b', propertyName: 'c', propertyN: 0 } }),
	'475.54613px',
);

assert.strictEqual(
	calc('random(calc(50px * 2), 500px)', { randomCaching: { documentID: 'a', elementID: 'b', propertyName: 'c', propertyN: 0 } }),
	'475.54613px',
);

assert.strictEqual(
	calc('random(--foo, 100px, 500px)', { randomCaching: { documentID: 'a', elementID: 'b', propertyName: 'c', propertyN: 0 } }),
	'319.55825px',
);

assert.strictEqual(
	calc('random(--foo, 80px + 20px, 500px)', { randomCaching: { documentID: 'a', elementID: 'b', propertyName: 'c', propertyN: 0 } }),
	'319.55825px',
);

assert.strictEqual(
	calc('random(--bar, 100px, 500px)', { randomCaching: { documentID: 'a', elementID: 'b', propertyName: 'c', propertyN: 0 } }),
	'441.70825px',
);

assert.strictEqual(
	calc('random(99px, 500px)', { randomCaching: { documentID: 'a', elementID: 'b', propertyName: 'c', propertyN: 0 } }),
	'475.48499px',
);

assert.strictEqual(
	calc('random(99, 500px)', { randomCaching: { documentID: 'a', elementID: 'b', propertyName: 'c', propertyN: 0 } }),
	'random(99, 500px)',
);

assert.strictEqual(
	calc('random(100px, 500px, 10px)', { randomCaching: { documentID: 'a', elementID: 'b', propertyName: 'c', propertyN: 0 } }),
	'480px',
);

assert.strictEqual(
	calc('random(100px, 500px, calc(5px * 2))', { randomCaching: { documentID: 'a', elementID: 'b', propertyName: 'c', propertyN: 0 } }),
	'480px',
);

assert.strictEqual(
	calc('random(--foo, 100px, 500px, 5px * 2)', { randomCaching: { documentID: 'a', elementID: 'b', propertyName: 'c', propertyN: 0 } }),
	'320px',
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
	'18.16596px',
);

assert.strictEqual(
	calc('random(-10px, 20px, 0px)', { randomCaching: { documentID: 'a', elementID: 'b', propertyName: 'c', propertyN: 0 } }),
	'18.16596px',
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
	'939.47666ms',
);

assert.strictEqual(
	calc('random(10deg, 10px)', { randomCaching: { documentID: 'a', elementID: 'b', propertyName: 'c', propertyN: 0 } }),
	'random(10deg, 10px)',
);

assert.strictEqual(
	calc('random(0%, 100%)', { randomCaching: { documentID: 'a', elementID: 'b', propertyName: 'c', propertyN: 0 } }),
	'93.88653%',
);

assert.strictEqual(
	calc('random(0deg, 360deg)', { randomCaching: { documentID: 'a', elementID: 'b', propertyName: 'c', propertyN: 0 } }),
	'337.99151deg',
);

assert.strictEqual(
	calc('random(--foo, 10, 20, -2)', { randomCaching: { documentID: 'a', elementID: 'b', propertyName: 'c', propertyN: 0 } }),
	'15.48896',
);

assert.strictEqual(
	calc('random(10, 20, 0.00005)', { randomCaching: { documentID: 'a', elementID: 'b', propertyName: 'c', propertyN: 0 } }), // Number of steps is small enough
	'19.3887',
);

assert.strictEqual(
	calc('random(10, 20, 0.000005)', { randomCaching: { documentID: 'a', elementID: 'b', propertyName: 'c', propertyN: 0 } }), // Number of steps is small enough
	'19.38865',
);

assert.strictEqual(
	calc('random(0, 1, 0.00000000005)', { randomCaching: { documentID: 'a', elementID: 'b', propertyName: 'c', propertyN: 0 } }), // Number of steps is too large
	'0.93887',
);

assert.strictEqual(
	calc('random(0, 10000000, 0.00000000005)', { randomCaching: { documentID: 'a', elementID: 'b', propertyName: 'c', propertyN: 0 } }), // Number of steps is too large
	'9388653.16566',
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
