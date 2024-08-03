import { calc } from '@csstools/css-calc';
import assert from 'node:assert';

assert.strictEqual(
	calc('pow(1,1)'),
	'1',
);

assert.strictEqual(
	calc('sqrt(1)'),
	'1',
);

assert.strictEqual(
	calc('hypot(1)'),
	'1',
);

assert.strictEqual(
	calc('sqrt(pow(1,1))'),
	'1',
);

assert.strictEqual(
	calc('hypot(pow(1, sqrt(1)))'),
	'1',
);

assert.strictEqual(
	calc('calc(hypot(pow((1 + sqrt(1)) / 2, sqrt(1))))'),
	'1',
);

assert.strictEqual(
	calc('calc(100px * pow(2, pow(2, 2)))'),
	'1600px',
);

assert.strictEqual(
	calc('calc(1px * pow(2, 3))'),
	'8px',
);

assert.strictEqual(
	calc('calc(100px * sqrt(100))'),
	'1000px',
);

assert.strictEqual(
	calc('calc(1px * pow(2, sqrt(100))'),
	'1024px',
);

assert.strictEqual(
	calc('hypot(3px, 4px)'),
	'5px',
);

assert.strictEqual(
	calc('calc(100px * hypot(3, 4))'),
	'500px',
);

assert.strictEqual(
	calc('hypot(-5px)'),
	'5px',
);

assert.strictEqual(
	calc('calc(1px * hypot(-5))'),
	'5px',
);

assert.strictEqual(
	calc('calc(1px * hypot(10000))'),
	'10000px',
);

assert.strictEqual(
	calc('calc(2px * sqrt(100000000))'),
	'20000px',
);

assert.strictEqual(
	calc('calc(3px * pow(200, 4))'),
	'4800000000px',
);

assert.strictEqual(
	calc('hypot(1px)'),
	'1px',
);

assert.strictEqual(
	calc('hypot(1cm)'),
	'1cm',
);

assert.strictEqual(
	calc('hypot(1mm)'),
	'1mm',
);

assert.strictEqual(
	calc('hypot(1Q)'),
	'1Q',
);

assert.strictEqual(
	calc('hypot(1in)'),
	'1in',
);

assert.strictEqual(
	calc('hypot(1pc)'),
	'1pc',
);

assert.strictEqual(
	calc('hypot(1pt)'),
	'1pt',
);

assert.strictEqual(
	calc('hypot(1em)'),
	'1em',
);

assert.strictEqual(
	calc('hypot(1ex)'),
	'1ex',
);

assert.strictEqual(
	calc('hypot(1ch)'),
	'1ch',
);

assert.strictEqual(
	calc('hypot(1rem)'),
	'1rem',
);

assert.strictEqual(
	calc('hypot(1vh)'),
	'1vh',
);

assert.strictEqual(
	calc('hypot(1vw)'),
	'1vw',
);

assert.strictEqual(
	calc('hypot(1vmin)'),
	'1vmin',
);

assert.strictEqual(
	calc('hypot(1vmax)'),
	'1vmax',
);

assert.strictEqual(
	calc('hypot(1s)'),
	'1s',
);

assert.strictEqual(
	calc('hypot(1ms)'),
	'1ms',
);

assert.strictEqual(
	calc('hypot(1deg)'),
	'1deg',
);

assert.strictEqual(
	calc('hypot(1grad)'),
	'1grad',
);

assert.strictEqual(
	calc('hypot(1rad)'),
	'1rad',
);

assert.strictEqual(
	calc('hypot(1turn)'),
	'1turn',
);
