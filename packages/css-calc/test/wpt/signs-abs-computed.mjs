import { calc } from '@csstools/css-calc';
import assert from 'assert';

assert.strictEqual(
	calc('calc(45deg + 45deg)'),
	'90deg',
);

assert.strictEqual(
	calc('abs(1)'),
	'1',
);

assert.strictEqual(
	calc('sign(1)'),
	'1',
);

assert.strictEqual(
	calc('abs(-1)'),
	'1',
);

assert.strictEqual(
	calc('sign(-1)'),
	'-1',
);

assert.strictEqual(
	calc('abs(sign(1))'),
	'1',
);

assert.strictEqual(
	calc('abs(sign(sign(1)))'),
	'1',
);

assert.strictEqual(
	calc('sign(sign(sign(1) + sign(1)))'),
	'1',
);

assert.strictEqual(
	calc('calc(abs(0.1 + 0.2) + 0.05)'),
	'0.35',
);

assert.strictEqual(
	calc('calc(sign(0.1 + 0.2) - 0.05)'),
	'0.95',
);

assert.strictEqual(
	calc('calc(abs(0.1 + 0.2) * 2)'),
	'0.6',
);

assert.strictEqual(
	calc('calc(abs(sign(0.1) + 0.2) / 2)'),
	'0.6',
);

assert.strictEqual(
	calc('calc(abs(0.1 + 0.2) * -2)'),
	'-0.6',
);

assert.strictEqual(
	calc('calc(sign(0.1 - 0.2) - 0.05)'),
	'-1.05',
);

assert.strictEqual(
	calc('calc(sign(1) + sign(1) - 0.05)'),
	'1.95',
);

assert.strictEqual(
	calc('calc(sign(calc(-1 * 0)))'),
	'calc(-1 * 0)',
);

assert.strictEqual(
	calc('calc(sign(0))'),
	'0',
);

assert.strictEqual(
	calc('sign(1px)'),
	'1',
);

assert.strictEqual(
	calc('sign(1cm)'),
	'1',
);

assert.strictEqual(
	calc('sign(1mm)'),
	'1',
);

assert.strictEqual(
	calc('sign(1Q)'),
	'1',
);

assert.strictEqual(
	calc('sign(1in)'),
	'1',
);

assert.strictEqual(
	calc('sign(1pc)'),
	'1',
);

assert.strictEqual(
	calc('sign(1pt)'),
	'1',
);

assert.strictEqual(
	calc('sign(1em)'),
	'1',
);

assert.strictEqual(
	calc('sign(1ex)'),
	'1',
);

assert.strictEqual(
	calc('sign(1ch)'),
	'1',
);

assert.strictEqual(
	calc('sign(1rem)'),
	'1',
);

assert.strictEqual(
	calc('sign(1vh)'),
	'1',
);

assert.strictEqual(
	calc('sign(1vw)'),
	'1',
);

assert.strictEqual(
	calc('sign(1vmin)'),
	'1',
);

assert.strictEqual(
	calc('sign(1vmax)'),
	'1',
);

assert.strictEqual(
	calc('sign(-1px)'),
	'-1',
);

assert.strictEqual(
	calc('sign(-1cm)'),
	'-1',
);

assert.strictEqual(
	calc('sign(-1mm)'),
	'-1',
);

assert.strictEqual(
	calc('sign(-1Q)'),
	'-1',
);

assert.strictEqual(
	calc('sign(-1in)'),
	'-1',
);

assert.strictEqual(
	calc('sign(-1pc)'),
	'-1',
);

assert.strictEqual(
	calc('sign(-1pt)'),
	'-1',
);

assert.strictEqual(
	calc('sign(-1em)'),
	'-1',
);

assert.strictEqual(
	calc('sign(-1ex)'),
	'-1',
);

assert.strictEqual(
	calc('sign(-1ch)'),
	'-1',
);

assert.strictEqual(
	calc('sign(-1rem)'),
	'-1',
);

assert.strictEqual(
	calc('sign(-1vh)'),
	'-1',
);

assert.strictEqual(
	calc('sign(-1vw)'),
	'-1',
);

assert.strictEqual(
	calc('sign(-1vmin)'),
	'-1',
);

assert.strictEqual(
	calc('sign(-1vmax)'),
	'-1',
);

assert.strictEqual(
	calc('sign(1s)'),
	'1',
);

assert.strictEqual(
	calc('sign(1ms)'),
	'1',
);

assert.strictEqual(
	calc('sign(-1s)'),
	'-1',
);

assert.strictEqual(
	calc('sign(-1ms)'),
	'-1',
);

assert.strictEqual(
	calc('sign(1deg)'),
	'1',
);

assert.strictEqual(
	calc('sign(1grad)'),
	'1',
);

assert.strictEqual(
	calc('sign(1rad)'),
	'1',
);

assert.strictEqual(
	calc('sign(1turn)'),
	'1',
);

assert.strictEqual(
	calc('sign(-1deg)'),
	'-1',
);

assert.strictEqual(
	calc('sign(-1grad)'),
	'-1',
);

assert.strictEqual(
	calc('sign(-1rad)'),
	'-1',
);

assert.strictEqual(
	calc('sign(-1turn)'),
	'-1',
);

assert.strictEqual(
	calc('sign(0px)'),
	'0',
);

assert.strictEqual(
	calc('sign(0cm)'),
	'0',
);

assert.strictEqual(
	calc('sign(0mm)'),
	'0',
);

assert.strictEqual(
	calc('sign(0Q)'),
	'0',
);

assert.strictEqual(
	calc('sign(0in)'),
	'0',
);

assert.strictEqual(
	calc('sign(0pc)'),
	'0',
);

assert.strictEqual(
	calc('sign(0pt)'),
	'0',
);

assert.strictEqual(
	calc('sign(0em)'),
	'0',
);

assert.strictEqual(
	calc('sign(0ex)'),
	'0',
);

assert.strictEqual(
	calc('sign(0ch)'),
	'0',
);

assert.strictEqual(
	calc('sign(0rem)'),
	'0',
);

assert.strictEqual(
	calc('sign(0vh)'),
	'0',
);

assert.strictEqual(
	calc('sign(0vw)'),
	'0',
);

assert.strictEqual(
	calc('sign(0vmin)'),
	'0',
);

assert.strictEqual(
	calc('sign(0vmax)'),
	'0',
);

assert.strictEqual(
	calc('sign(calc(-1 * 0px))'),
	'calc(-1 * 0)',
);

assert.strictEqual(
	calc('sign(calc(-1 * 0cm))'),
	'calc(-1 * 0)',
);

assert.strictEqual(
	calc('sign(calc(-1 * 0mm))'),
	'calc(-1 * 0)',
);

assert.strictEqual(
	calc('sign(calc(-1 * 0Q))'),
	'calc(-1 * 0)',
);

assert.strictEqual(
	calc('sign(calc(-1 * 0in))'),
	'calc(-1 * 0)',
);

assert.strictEqual(
	calc('sign(calc(-1 * 0pc))'),
	'calc(-1 * 0)',
);

assert.strictEqual(
	calc('sign(calc(-1 * 0pt))'),
	'calc(-1 * 0)',
);

assert.strictEqual(
	calc('sign(calc(-1 * 0em))'),
	'calc(-1 * 0)',
);

assert.strictEqual(
	calc('sign(calc(-1 * 0ex))'),
	'calc(-1 * 0)',
);

assert.strictEqual(
	calc('sign(calc(-1 * 0ch))'),
	'calc(-1 * 0)',
);

assert.strictEqual(
	calc('sign(calc(-1 * 0rem))'),
	'calc(-1 * 0)',
);

assert.strictEqual(
	calc('sign(calc(-1 * 0vh))'),
	'calc(-1 * 0)',
);

assert.strictEqual(
	calc('sign(calc(-1 * 0vw))'),
	'calc(-1 * 0)',
);

assert.strictEqual(
	calc('sign(calc(-1 * 0vmin))'),
	'calc(-1 * 0)',
);

assert.strictEqual(
	calc('sign(calc(-1 * 0vmax))'),
	'calc(-1 * 0)',
);

assert.strictEqual(
	calc('sign(0s)'),
	'0',
);

assert.strictEqual(
	calc('sign(0ms)'),
	'0',
);

assert.strictEqual(
	calc('sign(0deg)'),
	'0',
);

assert.strictEqual(
	calc('sign(0grad)'),
	'0',
);

assert.strictEqual(
	calc('sign(0rad)'),
	'0',
);

assert.strictEqual(
	calc('sign(0turn)'),
	'0',
);

assert.strictEqual(
	calc('sign(calc(-1 * 0deg))'),
	'calc(-1 * 0)',
);

assert.strictEqual(
	calc('sign(calc(-1 * 0grad))'),
	'calc(-1 * 0)',
);

assert.strictEqual(
	calc('sign(calc(-1 * 0rad))'),
	'calc(-1 * 0)',
);

assert.strictEqual(
	calc('sign(calc(-1 * 0turn))'),
	'calc(-1 * 0)',
);

assert.strictEqual(
	calc('abs(1px)'),
	'1px',
);

assert.strictEqual(
	calc('abs(1cm)'),
	'1cm',
);

assert.strictEqual(
	calc('abs(1mm)'),
	'1mm',
);

assert.strictEqual(
	calc('abs(1Q)'),
	'1Q',
);

assert.strictEqual(
	calc('abs(1in)'),
	'1in',
);

assert.strictEqual(
	calc('abs(1pc)'),
	'1pc',
);

assert.strictEqual(
	calc('abs(1pt)'),
	'1pt',
);

assert.strictEqual(
	calc('abs(1em)'),
	'1em',
);

assert.strictEqual(
	calc('abs(1ex)'),
	'1ex',
);

assert.strictEqual(
	calc('abs(1ch)'),
	'1ch',
);

assert.strictEqual(
	calc('abs(1rem)'),
	'1rem',
);

assert.strictEqual(
	calc('abs(1vh)'),
	'1vh',
);

assert.strictEqual(
	calc('abs(1vw)'),
	'1vw',
);

assert.strictEqual(
	calc('abs(1vmin)'),
	'1vmin',
);

assert.strictEqual(
	calc('abs(1vmax)'),
	'1vmax',
);

assert.strictEqual(
	calc('abs(-1px)'),
	'1px',
);

assert.strictEqual(
	calc('abs(-1cm)'),
	'1cm',
);

assert.strictEqual(
	calc('abs(-1mm)'),
	'1mm',
);

assert.strictEqual(
	calc('abs(-1Q)'),
	'1Q',
);

assert.strictEqual(
	calc('abs(-1in)'),
	'1in',
);

assert.strictEqual(
	calc('abs(-1pc)'),
	'1pc',
);

assert.strictEqual(
	calc('abs(-1pt)'),
	'1pt',
);

assert.strictEqual(
	calc('abs(-1em)'),
	'1em',
);

assert.strictEqual(
	calc('abs(-1ex)'),
	'1ex',
);

assert.strictEqual(
	calc('abs(-1ch)'),
	'1ch',
);

assert.strictEqual(
	calc('abs(-1rem)'),
	'1rem',
);

assert.strictEqual(
	calc('abs(-1vh)'),
	'1vh',
);

assert.strictEqual(
	calc('abs(-1vw)'),
	'1vw',
);

assert.strictEqual(
	calc('abs(-1vmin)'),
	'1vmin',
);

assert.strictEqual(
	calc('abs(-1vmax)'),
	'1vmax',
);

assert.strictEqual(
	calc('abs(1s)'),
	'1s',
);

assert.strictEqual(
	calc('abs(1ms)'),
	'1ms',
);

assert.strictEqual(
	calc('abs(-1s)'),
	'1s',
);

assert.strictEqual(
	calc('abs(-1ms)'),
	'1ms',
);

assert.strictEqual(
	calc('abs(1deg)'),
	'1deg',
);

assert.strictEqual(
	calc('abs(1grad)'),
	'1grad',
);

assert.strictEqual(
	calc('abs(1rad)'),
	'1rad',
);

assert.strictEqual(
	calc('abs(1turn)'),
	'1turn',
);

assert.strictEqual(
	calc('abs(-1deg)'),
	'1deg',
);

assert.strictEqual(
	calc('abs(-1grad)'),
	'1grad',
);

assert.strictEqual(
	calc('abs(-1rad)'),
	'1rad',
);

assert.strictEqual(
	calc('abs(-1turn)'),
	'1turn',
);
