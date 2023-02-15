import { convert } from '@csstools/css-calc';
import assert from 'assert';

assert.strictEqual(
	convert('calc(45deg + 45deg)'),
	'90deg',
);

assert.strictEqual(
	convert('abs(1)'),
	'1',
);

assert.strictEqual(
	convert('sign(1)'),
	'1',
);

assert.strictEqual(
	convert('abs(-1)'),
	'1',
);

assert.strictEqual(
	convert('sign(-1)'),
	'-1',
);

assert.strictEqual(
	convert('abs(sign(1))'),
	'1',
);

assert.strictEqual(
	convert('abs(sign(sign(1)))'),
	'1',
);

assert.strictEqual(
	convert('sign(sign(sign(1) + sign(1)))'),
	'1',
);

assert.strictEqual(
	convert('calc(abs(0.1 + 0.2) + 0.05)'),
	'0.35',
);

assert.strictEqual(
	convert('calc(sign(0.1 + 0.2) - 0.05)'),
	'0.95',
);

assert.strictEqual(
	convert('calc(abs(0.1 + 0.2) * 2)'),
	'0.6',
);

assert.strictEqual(
	convert('calc(abs(sign(0.1) + 0.2) / 2)'),
	'0.6',
);

assert.strictEqual(
	convert('calc(abs(0.1 + 0.2) * -2)'),
	'-0.6',
);

assert.strictEqual(
	convert('calc(sign(0.1 - 0.2) - 0.05)'),
	'-1.05',
);

assert.strictEqual(
	convert('calc(sign(1) + sign(1) - 0.05)'),
	'1.95',
);

assert.strictEqual(
	convert('calc(sign(-0))'),
	'-0',
);

assert.strictEqual(
	convert('calc(sign(0))'),
	'0',
);

assert.strictEqual(
	convert('sign(1px)'),
	'1',
);

assert.strictEqual(
	convert('sign(1cm)'),
	'1',
);

assert.strictEqual(
	convert('sign(1mm)'),
	'1',
);

assert.strictEqual(
	convert('sign(1Q)'),
	'1',
);

assert.strictEqual(
	convert('sign(1in)'),
	'1',
);

assert.strictEqual(
	convert('sign(1pc)'),
	'1',
);

assert.strictEqual(
	convert('sign(1pt)'),
	'1',
);

assert.strictEqual(
	convert('sign(1em)'),
	'1',
);

assert.strictEqual(
	convert('sign(1ex)'),
	'1',
);

assert.strictEqual(
	convert('sign(1ch)'),
	'1',
);

assert.strictEqual(
	convert('sign(1rem)'),
	'1',
);

assert.strictEqual(
	convert('sign(1vh)'),
	'1',
);

assert.strictEqual(
	convert('sign(1vw)'),
	'1',
);

assert.strictEqual(
	convert('sign(1vmin)'),
	'1',
);

assert.strictEqual(
	convert('sign(1vmax)'),
	'1',
);

assert.strictEqual(
	convert('sign(-1px)'),
	'-1',
);

assert.strictEqual(
	convert('sign(-1cm)'),
	'-1',
);

assert.strictEqual(
	convert('sign(-1mm)'),
	'-1',
);

assert.strictEqual(
	convert('sign(-1Q)'),
	'-1',
);

assert.strictEqual(
	convert('sign(-1in)'),
	'-1',
);

assert.strictEqual(
	convert('sign(-1pc)'),
	'-1',
);

assert.strictEqual(
	convert('sign(-1pt)'),
	'-1',
);

assert.strictEqual(
	convert('sign(-1em)'),
	'-1',
);

assert.strictEqual(
	convert('sign(-1ex)'),
	'-1',
);

assert.strictEqual(
	convert('sign(-1ch)'),
	'-1',
);

assert.strictEqual(
	convert('sign(-1rem)'),
	'-1',
);

assert.strictEqual(
	convert('sign(-1vh)'),
	'-1',
);

assert.strictEqual(
	convert('sign(-1vw)'),
	'-1',
);

assert.strictEqual(
	convert('sign(-1vmin)'),
	'-1',
);

assert.strictEqual(
	convert('sign(-1vmax)'),
	'-1',
);

assert.strictEqual(
	convert('sign(1s)'),
	'1',
);

assert.strictEqual(
	convert('sign(1ms)'),
	'1',
);

assert.strictEqual(
	convert('sign(-1s)'),
	'-1',
);

assert.strictEqual(
	convert('sign(-1ms)'),
	'-1',
);

assert.strictEqual(
	convert('sign(1deg)'),
	'1',
);

assert.strictEqual(
	convert('sign(1grad)'),
	'1',
);

assert.strictEqual(
	convert('sign(1rad)'),
	'1',
);

assert.strictEqual(
	convert('sign(1turn)'),
	'1',
);

assert.strictEqual(
	convert('sign(-1deg)'),
	'-1',
);

assert.strictEqual(
	convert('sign(-1grad)'),
	'-1',
);

assert.strictEqual(
	convert('sign(-1rad)'),
	'-1',
);

assert.strictEqual(
	convert('sign(-1turn)'),
	'-1',
);

assert.strictEqual(
	convert('sign(0px)'),
	'0',
);

assert.strictEqual(
	convert('sign(0cm)'),
	'0',
);

assert.strictEqual(
	convert('sign(0mm)'),
	'0',
);

assert.strictEqual(
	convert('sign(0Q)'),
	'0',
);

assert.strictEqual(
	convert('sign(0in)'),
	'0',
);

assert.strictEqual(
	convert('sign(0pc)'),
	'0',
);

assert.strictEqual(
	convert('sign(0pt)'),
	'0',
);

assert.strictEqual(
	convert('sign(0em)'),
	'0',
);

assert.strictEqual(
	convert('sign(0ex)'),
	'0',
);

assert.strictEqual(
	convert('sign(0ch)'),
	'0',
);

assert.strictEqual(
	convert('sign(0rem)'),
	'0',
);

assert.strictEqual(
	convert('sign(0vh)'),
	'0',
);

assert.strictEqual(
	convert('sign(0vw)'),
	'0',
);

assert.strictEqual(
	convert('sign(0vmin)'),
	'0',
);

assert.strictEqual(
	convert('sign(0vmax)'),
	'0',
);

assert.strictEqual(
	convert('sign(-0px)'),
	'-0',
);

assert.strictEqual(
	convert('sign(-0cm)'),
	'-0',
);

assert.strictEqual(
	convert('sign(-0mm)'),
	'-0',
);

assert.strictEqual(
	convert('sign(-0Q)'),
	'-0',
);

assert.strictEqual(
	convert('sign(-0in)'),
	'-0',
);

assert.strictEqual(
	convert('sign(-0pc)'),
	'-0',
);

assert.strictEqual(
	convert('sign(-0pt)'),
	'-0',
);

assert.strictEqual(
	convert('sign(-0em)'),
	'-0',
);

assert.strictEqual(
	convert('sign(-0ex)'),
	'-0',
);

assert.strictEqual(
	convert('sign(-0ch)'),
	'-0',
);

assert.strictEqual(
	convert('sign(-0rem)'),
	'-0',
);

assert.strictEqual(
	convert('sign(-0vh)'),
	'-0',
);

assert.strictEqual(
	convert('sign(-0vw)'),
	'-0',
);

assert.strictEqual(
	convert('sign(-0vmin)'),
	'-0',
);

assert.strictEqual(
	convert('sign(-0vmax)'),
	'-0',
);

assert.strictEqual(
	convert('sign(0s)'),
	'0',
);

assert.strictEqual(
	convert('sign(0ms)'),
	'0',
);

assert.strictEqual(
	convert('sign(0deg)'),
	'0',
);

assert.strictEqual(
	convert('sign(0grad)'),
	'0',
);

assert.strictEqual(
	convert('sign(0rad)'),
	'0',
);

assert.strictEqual(
	convert('sign(0turn)'),
	'0',
);

assert.strictEqual(
	convert('sign(-0deg)'),
	'-0',
);

assert.strictEqual(
	convert('sign(-0grad)'),
	'-0',
);

assert.strictEqual(
	convert('sign(-0rad)'),
	'-0',
);

assert.strictEqual(
	convert('sign(-0turn)'),
	'-0',
);

assert.strictEqual(
	convert('abs(1px)'),
	'1px',
);

assert.strictEqual(
	convert('abs(1cm)'),
	'1cm',
);

assert.strictEqual(
	convert('abs(1mm)'),
	'1mm',
);

assert.strictEqual(
	convert('abs(1Q)'),
	'1Q',
);

assert.strictEqual(
	convert('abs(1in)'),
	'1in',
);

assert.strictEqual(
	convert('abs(1pc)'),
	'1pc',
);

assert.strictEqual(
	convert('abs(1pt)'),
	'1pt',
);

assert.strictEqual(
	convert('abs(1em)'),
	'1em',
);

assert.strictEqual(
	convert('abs(1ex)'),
	'1ex',
);

assert.strictEqual(
	convert('abs(1ch)'),
	'1ch',
);

assert.strictEqual(
	convert('abs(1rem)'),
	'1rem',
);

assert.strictEqual(
	convert('abs(1vh)'),
	'1vh',
);

assert.strictEqual(
	convert('abs(1vw)'),
	'1vw',
);

assert.strictEqual(
	convert('abs(1vmin)'),
	'1vmin',
);

assert.strictEqual(
	convert('abs(1vmax)'),
	'1vmax',
);

assert.strictEqual(
	convert('abs(-1px)'),
	'1px',
);

assert.strictEqual(
	convert('abs(-1cm)'),
	'1cm',
);

assert.strictEqual(
	convert('abs(-1mm)'),
	'1mm',
);

assert.strictEqual(
	convert('abs(-1Q)'),
	'1Q',
);

assert.strictEqual(
	convert('abs(-1in)'),
	'1in',
);

assert.strictEqual(
	convert('abs(-1pc)'),
	'1pc',
);

assert.strictEqual(
	convert('abs(-1pt)'),
	'1pt',
);

assert.strictEqual(
	convert('abs(-1em)'),
	'1em',
);

assert.strictEqual(
	convert('abs(-1ex)'),
	'1ex',
);

assert.strictEqual(
	convert('abs(-1ch)'),
	'1ch',
);

assert.strictEqual(
	convert('abs(-1rem)'),
	'1rem',
);

assert.strictEqual(
	convert('abs(-1vh)'),
	'1vh',
);

assert.strictEqual(
	convert('abs(-1vw)'),
	'1vw',
);

assert.strictEqual(
	convert('abs(-1vmin)'),
	'1vmin',
);

assert.strictEqual(
	convert('abs(-1vmax)'),
	'1vmax',
);

assert.strictEqual(
	convert('abs(1s)'),
	'1s',
);

assert.strictEqual(
	convert('abs(1ms)'),
	'1ms',
);

assert.strictEqual(
	convert('abs(-1s)'),
	'1s',
);

assert.strictEqual(
	convert('abs(-1ms)'),
	'1ms',
);

assert.strictEqual(
	convert('abs(1deg)'),
	'1deg',
);

assert.strictEqual(
	convert('abs(1grad)'),
	'1grad',
);

assert.strictEqual(
	convert('abs(1rad)'),
	'1rad',
);

assert.strictEqual(
	convert('abs(1turn)'),
	'1turn',
);

assert.strictEqual(
	convert('abs(-1deg)'),
	'1deg',
);

assert.strictEqual(
	convert('abs(-1grad)'),
	'1grad',
);

assert.strictEqual(
	convert('abs(-1rad)'),
	'1rad',
);

assert.strictEqual(
	convert('abs(-1turn)'),
	'1turn',
);
