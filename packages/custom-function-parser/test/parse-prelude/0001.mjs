import assert from 'node:assert';
import { parse } from '@csstools/custom-function-parser';

// Cases derived from:
// https://github.com/web-platform-tests/wpt/blob/master/css/css-mixins/functions/at-function-parsing.html
//
// Only the cases that do not require full `<css-type>` syntax validation are
// asserted here. Type validation is part of the typed parameters iteration.

const valid = [
	'--foo()',
	'--foo( )',
	'--foo(--x)',
	'--foo( --x )',
	'--foo(--x auto)',
	'--foo(--x <angle>)',
	'--foo(--x <color>)',
	'--foo(--x <custom-ident>)',
	'--foo(--x <image>)',
	'--foo(--x <integer>)',
	'--foo(--x <length>)',
	'--foo(--x <length-percentage>)',
	'--foo(--x <number>)',
	'--foo(--x <percentage>)',
	'--foo(--x <resolution>)',
	'--foo(--x <string>)',
	'--foo(--x <time>)',
	'--foo(--x <url>)',
	'--foo(--x <transform-function>)',
	'--foo(--x <transform-list>)',
	'--foo(--x type(auto))',
	'--foo(--x type(<length>))',
	'--foo(--x type(<length> | auto))',
	'--foo(--x type(none | auto))',
	'--foo(--x type(*))',
	'--foo(--x, --y)',
	'--foo(--x, --y, --z)',
	'--foo(--x <length>, --y, --z)',
	'--foo(--x, --y <number>, --z <angle>)',
	'--foo(--x : 10px)',
	'--foo(--x type(*): 10px)',
	'--foo(--x <length>: 10px)',
	'--foo(--x <length>: 10px, --y)',
	'--foo(--x, --y <length>: 10px)',
	'--foo(--x type(<length> | auto): auto)',
	'--foo(--x type(<length> | auto) : auto)',
	'--foo(--x:1px, --y, --z:2px)',
	'--foo(--x: var(--y, 10px))',
	'--foo(--x <color>: rgb(1, 2, 3))',
	'--foo(--x: var(--y, 10px), --z: 2px)',
	'--foo(--x <length>: clamp(1px, 2px, 3px))',
	'--foo(--x: {1px, 2px})',
	'--foo(--x: --bar(1px, 2px))',
	'--foo(--x <length>#)',
	'--foo(--x <length>+)',
	'--foo(--x type(<length>+))',
	'--foo(--x <transform-function>#)',
	'--foo(--x <transform-function>+)',
	'--foo(--x) returns type(*)',
	'--foo(--x) returns <length>',
	'--foo(--x) returns <length>+',
	'--foo(--x) returns type(<length>)',
	'--foo(--x) returns type(<length> | auto)',
	'--foo(--x) returns type(foo | bar)',
];

const invalid = [
	'--foo ()',
	'--foo (--x)',
	'--foo(--x: 10px !important)',
	'--foo(--x: var(--y, 10px)',
	'--foo(!)',
	'--foo(,)',
	'--foo(,,,)',
	'--foo(--x, ;)',
	'--foo(;)',
	'--foo(])',
	'--foo(, --x])',
	'--foo(--x) !',
	'--foo(--x) ! <length>',
	'--foo(--x) length',
	'--foo(--x) returns',
	'--foo(--x) returns ',
	'--foo(--x): <length>',
	'--foo(--x): length',
	'--foo(--x) returneth <length>',
	'--foo(--x, --x)',
];

for (const source of valid) {
	assert.notStrictEqual(
		parse(source),
		false,
		`expected ${JSON.stringify(source)} to be valid`,
	);
}

for (const source of invalid) {
	assert.strictEqual(
		parse(source),
		false,
		`expected ${JSON.stringify(source)} to be invalid`,
	);
}
