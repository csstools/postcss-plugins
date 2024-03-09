import { calc } from '@csstools/css-calc';
import assert from 'assert';

assert.strictEqual(
	calc('calc(var(--b, calc(var(--c) * 1)))'),
	'calc(var(--b, calc(var(--c) * 1)))',
);

assert.strictEqual(
	calc('calc(var(--b, calc(10 * 1)))'),
	'calc(var(--b, 10))',
);

assert.strictEqual(
	calc('calc(1px + 1px)'),
	'2px',
);

assert.strictEqual(
	calc('calc(1px + 1px);baz:calc(2px+3px)'),
	'2px;baz:calc(2px+3px)',
);

assert.strictEqual(
	calc('calc(1rem * 1.5)'),
	'1.5rem',
);

assert.strictEqual(
	calc('calc(3em - 1em)'),
	'2em',
);

assert.strictEqual(
	calc('calc(2ex / 2)'),
	'1ex',
);

assert.strictEqual(
	calc('calc(50px - (20px - 30px))'),
	'60px',
);

assert.strictEqual(
	calc('calc(100px - (100px - 100%))'),
	'calc(100px - (100px - 100%))',
);

assert.strictEqual(
	calc('calc(100px + (100px - 100%))'),
	'calc(100px + (100px - 100%))',
);

assert.strictEqual(
	calc('calc(100% - 10px + 20px)'),
	'calc(100% - 10px + 20px)',
);

assert.strictEqual(
	calc('calc(100% + 10px - 20px)'),
	'calc(100% + 10px - 20px)',
);

assert.strictEqual(
	calc('calc(1px - (2em + 3%))'),
	'calc(1px - (2em + 3%))',
);

assert.strictEqual(
	calc('calc((100vw - 50em) / 2)'),
	'calc((100vw - 50em) / 2)',
);

assert.strictEqual(
	calc('calc(10px - (100vw - 50em) / 2)'),
	'calc(10px - (100vw - 50em) / 2)',
);

assert.strictEqual(
	calc('calc(1px - (2em + 4vh + 3%))'),
	'calc(1px - (2em + 4vh + 3%))',
);

assert.strictEqual(
	calc('calc(0px - (24px - (var(--a) - var(--b)) / 2 + var(--c)))'),
	'calc(0px - (24px - (var(--a) - var(--b)) / 2 + var(--c)))',
);

assert.strictEqual(
	calc('a calc(1px + 1px)'),
	'a 2px',
);

assert.strictEqual(
	calc('calc(1px + 1px) a'),
	'2px a',
);

assert.strictEqual(
	calc('a calc(1px + 1px) b'),
	'a 2px b',
);

assert.strictEqual(
	calc('a calc(1px + 1px) b calc(1em + 2em) c'),
	'a 2px b 3em c',
);

assert.strictEqual(
	calc('CALC(1px + 1px)'),
	'2px',
);

assert.strictEqual(
	calc('CALC(1px + CALC(2px / 2))'),
	'2px',
);

assert.strictEqual(
	calc('calc(\n1rem \n* 2 \n* 1.5)'),
	'3rem',
);

assert.strictEqual(
	calc('calc(100% + 1px)'),
	'calc(100% + 1px)',
);

assert.strictEqual(
	calc('calc(2rem - .14285em)'),
	'calc(2rem - .14285em)',
);

assert.strictEqual(
	calc('calc(1/100)'),
	'0.01',
);

assert.strictEqual(
	calc('calc(5/1000000)'),
	'0.000005',
);

assert.strictEqual(
	calc('calc(500px - 0px)'),
	'500px',
);

assert.strictEqual(
	calc('calc(1px + 1)'),
	'calc(1px + 1)',
);

// TODO : maybe we can normalize this, but extremely low prio
// assert.strictEqual(
// 	calc('calc(1s - 50ms)'),
// 	'0.95s',
// );

assert.strictEqual(
	calc('calc( 0 - 10px)'),
	'calc( 0 - 10px)',
);

assert.strictEqual(
	calc('calc( 0px - 10px)'),
	'-10px',
);

assert.strictEqual(
	calc('calc( (1em - calc( 10px + 10px)) / 2)'),
	'calc( (1em - 20px) / 2)',
);

assert.strictEqual(
	calc('calc(constant(safe-area-inset-left))'),
	'calc(constant(safe-area-inset-left))',
);

assert.strictEqual(
	calc('calc(env(safe-area-inset-left))'),
	'calc(env(safe-area-inset-left))',
);

assert.strictEqual(
	calc('calc(env(safe-area-inset-left, 50px 20px))'),
	'calc(env(safe-area-inset-left, 50px 20px))',
);

assert.strictEqual(
	calc('calc(unknown(safe-area-inset-left))'),
	'calc(unknown(safe-area-inset-left))',
);

assert.strictEqual(
	calc('calc(500px - 0px)'),
	'500px',
);

assert.strictEqual(
	calc('calc(1px + 1)'),
	'calc(1px + 1)',
);

assert.strictEqual(
	calc('calc(calc(calc(75.37px - 63.5px) - 900px) + calc(2 * 100px))'),
	'-688.13px',
);

assert.strictEqual(
	calc('calc(500px/0)'),
	'calc(infinity * 1px)',
);

assert.strictEqual(
	calc('calc(500px/-0)'),
	'calc(-infinity * 1px)',
);

assert.strictEqual(
	calc('calc(500px/2px)'),
	'calc(500px/2px)',
);

assert.strictEqual(
	calc('CALC(1PX + 1PX)'),
	'2PX',
);

assert.strictEqual(
	calc('CALC(VAR(--foo) + VAR(--bar))'),
	'CALC(VAR(--foo) + VAR(--bar))',
);

assert.strictEqual(
	calc('calc(100% / 3 * 3)'),
	'100%',
);

assert.strictEqual(
	calc('calc(calc(100% / 3) * 3)'),
	'100%',
);

assert.strictEqual(
	calc('calc(+100px + +100px)'),
	'200px',
);

assert.strictEqual(
	calc('calc(+100px - +100px)'),
	'0px',
);

assert.strictEqual(
	calc('calc(200px * +1)'),
	'200px',
);

assert.strictEqual(
	calc('calc(200px / +1)'),
	'200px',
);

assert.strictEqual(
	calc('calc(-100px + -100px)'),
	'-200px',
);

assert.strictEqual(
	calc('calc(-100px - -100px)'),
	'0px',
);

assert.strictEqual(
	calc('calc(200px * -1)'),
	'-200px',
);

assert.strictEqual(
	calc('calc(200px / -1)'),
	'-200px',
);

assert.strictEqual(
	calc('calc( 100px + 100px )'),
	'200px',
);

assert.strictEqual(
	calc('calc(\t100px\t+\t100px\t)'),
	'200px',
);

assert.strictEqual(
	calc('calc(\n100px\n+\n100px\n)'),
	'200px',
);

assert.strictEqual(
	calc('calc(\r\n100px\r\n+\r\n100px\r\n)'),
	'200px',
);

assert.strictEqual(
	calc('calc(/*test*/100px/*test*/ + /*test*/100px/*test*/)'),
	'200px',
);

assert.strictEqual(
	calc('calc(/*test*/100px/*test*/*/*test*/2/*test*/)'),
	'200px',
);

assert.strictEqual(
	calc('calc(/*test*/100px + calc(/*test*/100px/*test*/ + /*test*/100px/*test*/))'),
	'300px',
);

assert.strictEqual(
	calc('calc(1.1e+1px + 1.1e+1px)'),
	'22px',
);

assert.strictEqual(
	calc('calc(10e+1px + 10e+1px)'),
	'200px',
);

assert.strictEqual(
	calc('calc(1.1e+10px + 1.1e+10px)'),
	'22000000000px',
);

assert.strictEqual(
	calc('calc(9e+1 * 1px)'),
	'90px',
);

assert.strictEqual(
	calc('calc(9e+1% + 10%)'),
	'100%',
);

assert.strictEqual(
	calc('calc(1.1E+1px + 1.1E+1px)'),
	'22px',
);

assert.strictEqual(
	calc('calc(10Q + 10Q)'),
	'20Q',
);

assert.strictEqual(
	calc('calc(1unknown + 2unknown)'),
	'3unknown',
);

assert.strictEqual(
	calc('calc(1unknown + 2px)'),
	'calc(1unknown + 2px)',
);

assert.strictEqual(
	calc('calc(1px + 2unknown)'),
	'calc(1px + 2unknown)',
);
