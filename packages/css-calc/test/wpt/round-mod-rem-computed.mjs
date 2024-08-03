import { calc } from '@csstools/css-calc';
import assert from 'node:assert';

assert.strictEqual(
	calc('calc(45deg + 45deg)'),
	'90deg',
);

assert.strictEqual(
	calc('round(10,10)'),
	'10',
);

assert.strictEqual(
	calc('mod(1,1)'),
	'0',
);

assert.strictEqual(
	calc('rem(1,1)'),
	'0',
);

assert.strictEqual(
	calc('calc(round(100,10))'),
	'100',
);

assert.strictEqual(
	calc('calc(round(up, 101,10))'),
	'110',
);

assert.strictEqual(
	calc('calc(round(down, 106,10))'),
	'100',
);

assert.strictEqual(
	calc('calc(round(to-zero,105, 10))'),
	'100',
);

assert.strictEqual(
	calc('calc(round(to-zero,-105, 10))'),
	'-100',
);

assert.strictEqual(
	calc('calc(round(-100,10))'),
	'-100',
);

assert.strictEqual(
	calc('calc(round(up, -103,10))'),
	'-100',
);

assert.strictEqual(
	calc('mod(18,5)'),
	'3',
);

assert.strictEqual(
	calc('rem(18,5)'),
	'3',
);

assert.strictEqual(
	calc('mod(-140,-90)'),
	'-50',
);

assert.strictEqual(
	calc('mod(-18,5)'),
	'2',
);

assert.strictEqual(
	calc('rem(-18,5)'),
	'-3',
);

assert.strictEqual(
	calc('mod(140,-90)'),
	'-40',
);

assert.strictEqual(
	calc('rem(140,-90)'),
	'50',
);

assert.strictEqual(
	calc('calc(round(round(100,10), 10))'),
	'100',
);

assert.strictEqual(
	calc('calc(round(up, round(100,10) + 1,10))'),
	'110',
);

assert.strictEqual(
	calc('calc(round(down, round(100,10) + 2 * 3,10))'),
	'100',
);

assert.strictEqual(
	calc('calc(round(to-zero,round(100,10) * 2 - 95, 10))'),
	'100',
);

assert.strictEqual(
	calc('calc(round(round(100,10)* -1,10))'),
	'-100',
);

assert.strictEqual(
	calc('calc(round(up, -103 + -103 / -103 - 1,10))'),
	'-100',
);

assert.strictEqual(
	calc('calc(mod(18,5) * 2 + mod(17,5))'),
	'8',
);

assert.strictEqual(
	calc('calc(rem(mod(18,5),5))'),
	'3',
);

assert.strictEqual(
	calc('calc(rem(mod(18,5),mod(17,5)))'),
	'1',
);

assert.strictEqual(
	calc('calc(mod(-140,-90))'),
	'-50',
);

assert.strictEqual(
	calc('calc(mod(rem(1,18)* -1,5))'),
	'4',
);

assert.strictEqual(
	calc('round(10px,6px)'),
	'12px',
);

assert.strictEqual(
	calc('round(10cm,6cm)'),
	'12cm',
);

assert.strictEqual(
	calc('round(10mm,6mm)'),
	'12mm',
);

assert.strictEqual(
	calc('round(10Q, 6Q)'),
	'12Q',
);

assert.strictEqual(
	calc('round(10in,6in)'),
	'12in',
);

assert.strictEqual(
	calc('round(10pc,6pc)'),
	'12pc',
);

assert.strictEqual(
	calc('round(10pt,6pt)'),
	'12pt',
);

assert.strictEqual(
	calc('round(10em,6em)'),
	'12em',
);

assert.strictEqual(
	calc('round(10ex,6ex)'),
	'12ex',
);

assert.strictEqual(
	calc('round(10ch,6ch)'),
	'12ch',
);

assert.strictEqual(
	calc('round(10rem,6rem)'),
	'12rem',
);

assert.strictEqual(
	calc('round(10vh,6vh)'),
	'12vh',
);

assert.strictEqual(
	calc('round(10vw,6vw)'),
	'12vw',
);

assert.strictEqual(
	calc('round(10vmin,6vmin)'),
	'12vmin',
);

assert.strictEqual(
	calc('round(10vmax,6vmax)'),
	'12vmax',
);

assert.strictEqual(
	calc('round(10s,6s)'),
	'12s',
);

assert.strictEqual(
	calc('round(10ms,6ms)'),
	'12ms',
);

assert.strictEqual(
	calc('round(10deg,6deg)'),
	'12deg',
);

assert.strictEqual(
	calc('round(10grad,6grad)'),
	'12grad',
);

assert.strictEqual(
	calc('round(10rad,6rad)'),
	'12rad',
);

assert.strictEqual(
	calc('round(10turn,6turn)'),
	'12turn',
);

assert.strictEqual(
	calc('mod(10px,6px)'),
	'4px',
);

assert.strictEqual(
	calc('mod(10cm,6cm)'),
	'4cm',
);

assert.strictEqual(
	calc('mod(10mm,6mm)'),
	'4mm',
);

assert.strictEqual(
	calc('mod(10Q, 6Q)'),
	'4Q',
);

assert.strictEqual(
	calc('mod(10in,6in)'),
	'4in',
);

assert.strictEqual(
	calc('mod(10pc,6pc)'),
	'4pc',
);

assert.strictEqual(
	calc('mod(10em,6em)'),
	'4em',
);

assert.strictEqual(
	calc('mod(10ex,6ex)'),
	'4ex',
);

assert.strictEqual(
	calc('mod(10ch,6ch)'),
	'4ch',
);

assert.strictEqual(
	calc('mod(10rem,6rem)'),
	'4rem',
);

assert.strictEqual(
	calc('mod(10vh,6vh)'),
	'4vh',
);

assert.strictEqual(
	calc('mod(10vw,6vw)'),
	'4vw',
);

assert.strictEqual(
	calc('mod(10vmin,6vmin)'),
	'4vmin',
);

assert.strictEqual(
	calc('mod(10vmax,6vmax)'),
	'4vmax',
);

assert.strictEqual(
	calc('mod(10s,6s)'),
	'4s',
);

assert.strictEqual(
	calc('mod(10ms,6ms)'),
	'4ms',
);

assert.strictEqual(
	calc('mod(10deg,6deg)'),
	'4deg',
);

assert.strictEqual(
	calc('mod(10grad,6grad)'),
	'4grad',
);

assert.strictEqual(
	calc('mod(10rad,6rad)'),
	'4rad',
);

assert.strictEqual(
	calc('mod(10turn,6turn)'),
	'4turn',
);

assert.strictEqual(
	calc('rem(10px,6px)'),
	'4px',
);

assert.strictEqual(
	calc('rem(10cm,6cm)'),
	'4cm',
);

assert.strictEqual(
	calc('rem(10mm,6mm)'),
	'4mm',
);

assert.strictEqual(
	calc('rem(10Q, 6Q)'),
	'4Q',
);

assert.strictEqual(
	calc('rem(10in,6in)'),
	'4in',
);

assert.strictEqual(
	calc('rem(10pc,6pc)'),
	'4pc',
);

assert.strictEqual(
	calc('rem(10em,6em)'),
	'4em',
);

assert.strictEqual(
	calc('rem(10ex,6ex)'),
	'4ex',
);

assert.strictEqual(
	calc('rem(10ch,6ch)'),
	'4ch',
);

assert.strictEqual(
	calc('rem(10rem,6rem)'),
	'4rem',
);

assert.strictEqual(
	calc('rem(10vh,6vh)'),
	'4vh',
);

assert.strictEqual(
	calc('rem(10vw,6vw)'),
	'4vw',
);

assert.strictEqual(
	calc('rem(10vmin,6vmin)'),
	'4vmin',
);

assert.strictEqual(
	calc('rem(10vmax,6vmax)'),
	'4vmax',
);

assert.strictEqual(
	calc('rem(10s,6s)'),
	'4s',
);

assert.strictEqual(
	calc('rem(10ms,6ms)'),
	'4ms',
);

assert.strictEqual(
	calc('rem(10deg,6deg)'),
	'4deg',
);

assert.strictEqual(
	calc('rem(10grad,6grad)'),
	'4grad',
);

assert.strictEqual(
	calc('rem(10rad,6rad)'),
	'4rad',
);

assert.strictEqual(
	calc('rem(10turn,6turn)'),
	'4turn',
);

assert.strictEqual(
	calc('round(10%,5px)'),
	'round(10%,5px)',
);

assert.strictEqual(
	calc('round(2rem,5px)'),
	'round(2rem,5px)',
);

assert.strictEqual(
	calc('round(100px,1rem)'),
	'round(100px,1rem)',
);

assert.strictEqual(
	calc('round(10s,6000ms)'),
	'12s',
);

assert.strictEqual(
	calc('round(10000ms,6s)'),
	'12000ms',
);

assert.strictEqual(
	calc('mod(10%,1px)'),
	'mod(10%,1px)',
);

assert.strictEqual(
	calc('mod(10%,5px)'),
	'mod(10%,5px)',
);

assert.strictEqual(
	calc('mod(10s,6000ms)'),
	'4s',
);

assert.strictEqual(
	calc('mod(10000ms,6s)'),
	'4000ms',
);

assert.strictEqual(
	calc('mod(18px,100% / 15)'),
	'mod(18px,100% / 15)',
);

assert.strictEqual(
	calc('mod(18%,5%)'),
	'3%',
);

assert.strictEqual(
	calc('mod(-18%,5%)'),
	'2%',
);

assert.strictEqual(
	calc('mod(18vw,5vw)'),
	'3vw',
);

assert.strictEqual(
	calc('mod(-18vw,5vw)'),
	'2vw',
);

assert.strictEqual(
	calc('rem(10%,1px)'),
	'rem(10%,1px)',
);

assert.strictEqual(
	calc('rem(10%,5px)'),
	'rem(10%,5px)',
);

assert.strictEqual(
	calc('rem(2rem,5px)'),
	'rem(2rem,5px)',
);

assert.strictEqual(
	calc('rem(100px,1rem)'),
	'rem(100px,1rem)',
);

assert.strictEqual(
	calc('rem(10s,6000ms)'),
	'4s',
);

assert.strictEqual(
	calc('rem(10000ms,6s)'),
	'4000ms',
);

assert.strictEqual(
	calc('rem(18px,100% / 15)'),
	'rem(18px,100% / 15)',
);

assert.strictEqual(
	calc('rem(-18px,100% / 15)'),
	'rem(-18px,100% / 15)',
);

assert.strictEqual(
	calc('rem(18vw,5vw)'),
	'3vw',
);

assert.strictEqual(
	calc('rem(-18vw,5vw)'),
	'-3vw',
);
