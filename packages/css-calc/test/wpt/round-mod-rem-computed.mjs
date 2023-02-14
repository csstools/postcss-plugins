import { convert } from '@csstools/css-calc';
import assert from 'assert';

assert.strictEqual(
	convert('calc(45deg + 45deg)'),
	'90deg',
);

// Simple tests
assert.strictEqual(
	convert('round(10,10)'),
	'10',
);

assert.strictEqual(
	convert('mod(1,1)'),
	'0',
);

assert.strictEqual(
	convert('rem(1,1)'),
	'0',
);


//Test basic round
assert.strictEqual(
	convert('calc(round(100,10))'),
	'100',
);

assert.strictEqual(
	convert('calc(round(up, 101,10))'),
	'110',
);

assert.strictEqual(
	convert('calc(round(down, 106,10))'),
	'100',
);

assert.strictEqual(
	convert('calc(round(to-zero,105, 10))'),
	'100',
);

assert.strictEqual(
	convert('calc(round(to-zero,-105, 10))'),
	'-100',
);

assert.strictEqual(
	convert('calc(round(-100,10))'),
	'-100',
);

assert.strictEqual(
	convert('calc(round(up, -103,10))'),
	'-100',
);


//Test basic mod/rem
assert.strictEqual(
	convert('mod(18,5)'),
	'3',
);

assert.strictEqual(
	convert('rem(18,5)'),
	'3',
);

assert.strictEqual(
	convert('mod(-140,-90)'),
	'-50',
);

assert.strictEqual(
	convert('mod(-18,5)'),
	'2',
);

assert.strictEqual(
	convert('rem(-18,5)'),
	'-3',
);

assert.strictEqual(
	convert('mod(140,-90)'),
	'-40',
);

assert.strictEqual(
	convert('rem(140,-90)'),
	'50',
);


//Test basic calculations
assert.strictEqual(
	convert('calc(round(round(100,10), 10))'),
	'100',
);

assert.strictEqual(
	convert('calc(round(up, round(100,10) + 1,10))'),
	'110',
);

assert.strictEqual(
	convert('calc(round(down, round(100,10) + 2 * 3,10))'),
	'100',
);

assert.strictEqual(
	convert('calc(round(to-zero,round(100,10) * 2 - 95, 10))'),
	'100',
);

assert.strictEqual(
	convert('calc(round(round(100,10)* -1,10))'),
	'-100',
);

assert.strictEqual(
	convert('calc(round(up, -103 + -103 / -103 - 1,10))'),
	'-100',
);

assert.strictEqual(
	convert('calc(mod(18,5) * 2 + mod(17,5))'),
	'8',
);

assert.strictEqual(
	convert('calc(rem(mod(18,5),5))'),
	'3',
);

assert.strictEqual(
	convert('calc(rem(mod(18,5),mod(17,5)))'),
	'1',
);

assert.strictEqual(
	convert('calc(mod(-140,-90))'),
	'-50',
);

assert.strictEqual(
	convert('calc(mod(rem(1,18)* -1,5))'),
	'4',
);


// Type check
assert.strictEqual(
	convert('round(10px,6px)'),
	'12px',
);

assert.strictEqual(
	convert('round(10cm,6cm)'),
	'12cm',
);

assert.strictEqual(
	convert('round(10mm,6mm)'),
	'12mm',
);

assert.strictEqual(
	convert('round(10Q, 6Q)'),
	'12Q',
);

assert.strictEqual(
	convert('round(10in,6in)'),
	'12in',
);

assert.strictEqual(
	convert('round(10pc,6pc)'),
	'12pc',
);

assert.strictEqual(
	convert('round(10pt,6pt)'),
	'12pt',
);

assert.strictEqual(
	convert('round(10em,6em)'),
	'12em',
);

assert.strictEqual(
	convert('round(10ex,6ex)'),
	'12ex',
);

assert.strictEqual(
	convert('round(10ch,6ch)'),
	'12ch',
);

assert.strictEqual(
	convert('round(10rem,6rem)'),
	'12rem',
);

assert.strictEqual(
	convert('round(10vh,6vh)'),
	'12vh',
);

assert.strictEqual(
	convert('round(10vw,6vw)'),
	'12vw',
);

assert.strictEqual(
	convert('round(10vmin,6vmin)'),
	'12vmin',
);

assert.strictEqual(
	convert('round(10vmax,6vmax)'),
	'12vmax',
);

assert.strictEqual(
	convert('round(10s,6s)'),
	'12s',
);

assert.strictEqual(
	convert('round(10ms,6ms)'),
	'12ms',
);

assert.strictEqual(
	convert('round(10deg,6deg)'),
	'12deg',
);

assert.strictEqual(
	convert('round(10grad,6grad)'),
	'12grad',
);

assert.strictEqual(
	convert('round(10rad,6rad)'),
	'12rad',
);

assert.strictEqual(
	convert('round(10turn,6turn)'),
	'12turn',
);


assert.strictEqual(
	convert('mod(10px,6px)'),
	'4px',
);

assert.strictEqual(
	convert('mod(10cm,6cm)'),
	'4cm',
);

assert.strictEqual(
	convert('mod(10mm,6mm)'),
	'4mm',
);

assert.strictEqual(
	convert('mod(10Q, 6Q)'),
	'4Q',
);

assert.strictEqual(
	convert('mod(10in,6in)'),
	'4in',
);

assert.strictEqual(
	convert('mod(10pc,6pc)'),
	'4pc',
);

assert.strictEqual(
	convert('mod(10em,6em)'),
	'4em',
);

assert.strictEqual(
	convert('mod(10ex,6ex)'),
	'4ex',
);

assert.strictEqual(
	convert('mod(10ch,6ch)'),
	'4ch',
);

assert.strictEqual(
	convert('mod(10rem,6rem)'),
	'4rem',
);

assert.strictEqual(
	convert('mod(10vh,6vh)'),
	'4vh',
);

assert.strictEqual(
	convert('mod(10vw,6vw)'),
	'4vw',
);

assert.strictEqual(
	convert('mod(10vmin,6vmin)'),
	'4vmin',
);

assert.strictEqual(
	convert('mod(10vmax,6vmax)'),
	'4vmax',
);

assert.strictEqual(
	convert('mod(10s,6s)'),
	'4s',
);

assert.strictEqual(
	convert('mod(10ms,6ms)'),
	'4ms',
);

assert.strictEqual(
	convert('mod(10deg,6deg)'),
	'4deg',
);

assert.strictEqual(
	convert('mod(10grad,6grad)'),
	'4grad',
);

assert.strictEqual(
	convert('mod(10rad,6rad)'),
	'4rad',
);

assert.strictEqual(
	convert('mod(10turn,6turn)'),
	'4turn',
);


assert.strictEqual(
	convert('rem(10px,6px)'),
	'4px',
);

assert.strictEqual(
	convert('rem(10cm,6cm)'),
	'4cm',
);

assert.strictEqual(
	convert('rem(10mm,6mm)'),
	'4mm',
);

assert.strictEqual(
	convert('rem(10Q, 6Q)'),
	'4Q',
);

assert.strictEqual(
	convert('rem(10in,6in)'),
	'4in',
);

assert.strictEqual(
	convert('rem(10pc,6pc)'),
	'4pc',
);

assert.strictEqual(
	convert('rem(10em,6em)'),
	'4em',
);

assert.strictEqual(
	convert('rem(10ex,6ex)'),
	'4ex',
);

assert.strictEqual(
	convert('rem(10ch,6ch)'),
	'4ch',
);

assert.strictEqual(
	convert('rem(10rem,6rem)'),
	'4rem',
);

assert.strictEqual(
	convert('rem(10vh,6vh)'),
	'4vh',
);

assert.strictEqual(
	convert('rem(10vw,6vw)'),
	'4vw',
);

assert.strictEqual(
	convert('rem(10vmin,6vmin)'),
	'4vmin',
);

assert.strictEqual(
	convert('rem(10vmax,6vmax)'),
	'4vmax',
);

assert.strictEqual(
	convert('rem(10s,6s)'),
	'4s',
);

assert.strictEqual(
	convert('rem(10ms,6ms)'),
	'4ms',
);

assert.strictEqual(
	convert('rem(10deg,6deg)'),
	'4deg',
);

assert.strictEqual(
	convert('rem(10grad,6grad)'),
	'4grad',
);

assert.strictEqual(
	convert('rem(10rad,6rad)'),
	'4rad',
);

assert.strictEqual(
	convert('rem(10turn,6turn)'),
	'4turn',
);

//Test percentage and mixed units
assert.strictEqual(
	convert('round(10%,5px)'),
	'round(10%,5px)',
);

assert.strictEqual(
	convert('round(2rem,5px)'),
	'round(2rem,5px)',
);

assert.strictEqual(
	convert('round(100px,1rem)'),
	'round(100px,1rem)',
);

assert.strictEqual(
	convert('round(10s,6000ms)'),
	'12s',
);

assert.strictEqual(
	convert('round(10000ms,6s)'),
	'12000ms',
);

assert.strictEqual(
	convert('mod(10%,1px)'),
	'mod(10%,1px)',
);

assert.strictEqual(
	convert('mod(10%,5px)'),
	'mod(10%,5px)',
);

assert.strictEqual(
	convert('mod(10s,6000ms)'),
	'4s',
);

assert.strictEqual(
	convert('mod(10000ms,6s)'),
	'4000ms',
);

assert.strictEqual(
	convert('mod(18px,100% / 15)'),
	'mod(18px,100% / 15)',
);

assert.strictEqual(
	convert('mod(18%,5%)'),
	'3%',
);

assert.strictEqual(
	convert('mod(-18%,5%)'),
	'2%',
);

assert.strictEqual(
	convert('mod(18vw,5vw)'),
	'3vw',
);

assert.strictEqual(
	convert('mod(-18vw,5vw)'),
	'2vw',
);

assert.strictEqual(
	convert('rem(10%,1px)'),
	'rem(10%,1px)',
);

assert.strictEqual(
	convert('rem(10%,5px)'),
	'rem(10%,5px)',
);

assert.strictEqual(
	convert('rem(2rem,5px)'),
	'rem(2rem,5px)',
);

assert.strictEqual(
	convert('rem(100px,1rem)'),
	'rem(100px,1rem)',
);

assert.strictEqual(
	convert('rem(10s,6000ms)'),
	'4s',
);

assert.strictEqual(
	convert('rem(10000ms,6s)'),
	'4000ms',
);

assert.strictEqual(
	convert('rem(18px,100% / 15)'),
	'rem(18px,100% / 15)',
);

assert.strictEqual(
	convert('rem(-18px,100% / 15)'),
	'rem(-18px,100% / 15)',
);

assert.strictEqual(
	convert('rem(18vw,5vw)'),
	'3vw',
);

assert.strictEqual(
	convert('rem(-18vw,5vw)'),
	'-3vw',
);

