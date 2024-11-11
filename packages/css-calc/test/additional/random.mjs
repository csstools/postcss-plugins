import { calc } from '@csstools/css-calc';
import assert from 'node:assert';

assert.strictEqual(
	calc('random(100px, 500px)'),
	'466.96922px',
);

assert.strictEqual(
	calc('random(calc(80px + 20px), 500px)'),
	'466.96922px',
);

assert.strictEqual(
	calc('random(80px + 20px, 500px)'),
	'466.96922px',
);

assert.strictEqual(
	calc('random(calc(50px * 2), 500px)'),
	'466.96922px',
);

assert.strictEqual(
	calc('random(--foo, 100px, 500px)'),
	'385.03443px',
);

assert.strictEqual(
	calc('random(--foo, 80px + 20px, 500px)'),
	'385.03443px',
);

assert.strictEqual(
	calc('random(--bar, 100px, 500px)'),
	'247.498px',
);

assert.strictEqual(
	calc('random(99px, 500px)'),
	'353.2884px',
);

assert.strictEqual(
	calc('random(99, 500px)'),
	'random(99, 500px)',
);

assert.strictEqual(
	calc('random(100px, 500px, by 10px)'),
	'200px',
);

assert.strictEqual(
	calc('random(100px, 500px, by calc(5px * 2))'),
	'200px',
);

assert.strictEqual(
	calc('random(--foo, 100px, 500px, by 5px * 2)'),
	'490px',
);

assert.strictEqual(
	calc('random(-10px, 20px, by 50px)'),
	'-10px',
);

assert.strictEqual(
	calc('random(--foo, -10px, 20px, by 50px)'),
	'-10px',
);

assert.strictEqual(
	calc('random(--bar, -10px, 20px, by 50px)'),
	'-10px',
);

assert.strictEqual(
	calc('random(-10px, 60px, by 50px)'),
	'-10px',
);

assert.strictEqual(
	calc('random(--foo, -10px, 60px, by 50px)'),
	'40px',
);

assert.strictEqual(
	calc('random(--bar, -10px, 60px, by 50px)'),
	'-10px',
);

assert.strictEqual(
	calc('random(-10px, 20px, by -50px)'),
	'-10px',
);

assert.strictEqual(
	calc('random(-10px, 20px, by 0px)'),
	'-10px',
);

assert.strictEqual(
	calc('random(-10px, 20px, by calc(10px * infinity))'),
	'-10px',
);

assert.strictEqual(
	calc('random(-10px, 20px, by (1px / 0))'),
	'-10px',
);

assert.strictEqual(
	calc('random(calc(10px * infinity), 20px)'),
	'calc(NaN * 1px)',
);

assert.strictEqual(
	calc('random(-10px, calc(10px * infinity))'),
	'calc(NaN * 1px)',
);

assert.strictEqual(
	calc('random(10ms, 1s)'),
	'934.64243ms',
);

assert.strictEqual(
	calc('random(10deg, 10px)'),
	'random(10deg, 10px)',
);
