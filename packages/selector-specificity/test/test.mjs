import assert from 'assert';
import { selectorSpecificity } from '@csstools/selector-specificity';
import parser from 'postcss-selector-parser';

function calculate(selector) {
	const selectorAST = parser().astSync(selector);
	return selectorSpecificity(selectorAST);
}

assert.deepEqual(calculate('*'), { a: 0, b: 0, c: 0 });
assert.deepEqual(calculate(':where(*)'), { a: 0, b: 0, c: 0 });
assert.deepEqual(calculate(':is(*)'), { a: 0, b: 0, c: 0 });
assert.deepEqual(calculate(':not(*)'), { a: 0, b: 0, c: 0 });
assert.deepEqual(calculate(':where(*)'), { a: 0, b: 0, c: 0 });

assert.deepEqual(calculate(':-moz-any'), { a: 0, b: 0, c: 0 });
assert.deepEqual(calculate(':-moz-any()'), { a: 0, b: 0, c: 0 });
assert.deepEqual(calculate(':-moz-any(.a)'), { a: 0, b: 1, c: 0 });
assert.deepEqual(calculate(':-webkit-any'), { a: 0, b: 0, c: 0 });
assert.deepEqual(calculate(':-webkit-any()'), { a: 0, b: 0, c: 0 });
assert.deepEqual(calculate(':-webkit-any(.a)'), { a: 0, b: 1, c: 0 });
assert.deepEqual(calculate(':any'), { a: 0, b: 0, c: 0 });
assert.deepEqual(calculate(':any()'), { a: 0, b: 0, c: 0 });
assert.deepEqual(calculate(':any(.a)'), { a: 0, b: 1, c: 0 });
assert.deepEqual(calculate(':has'), { a: 0, b: 0, c: 0 });
assert.deepEqual(calculate(':has()'), { a: 0, b: 0, c: 0 });
assert.deepEqual(calculate(':has(.a)'), { a: 0, b: 1, c: 0 });
assert.deepEqual(calculate(':is'), { a: 0, b: 0, c: 0 });
assert.deepEqual(calculate(':is()'), { a: 0, b: 0, c: 0 });
assert.deepEqual(calculate(':is(.a)'), { a: 0, b: 1, c: 0 });
assert.deepEqual(calculate(':matches'), { a: 0, b: 0, c: 0 });
assert.deepEqual(calculate(':matches()'), { a: 0, b: 0, c: 0 });
assert.deepEqual(calculate(':matches(.a)'), { a: 0, b: 1, c: 0 });
assert.deepEqual(calculate(':not'), { a: 0, b: 0, c: 0 });
assert.deepEqual(calculate(':not()'), { a: 0, b: 0, c: 0 });
assert.deepEqual(calculate(':not(.a)'), { a: 0, b: 1, c: 0 });
assert.deepEqual(calculate(':where'), { a: 0, b: 0, c: 0 });
assert.deepEqual(calculate(':where()'), { a: 0, b: 0, c: 0 });
assert.deepEqual(calculate(':where(.a)'), { a: 0, b: 0, c: 0 });

assert.deepEqual(calculate(':nth-child'), { a: 0, b: 1, c: 0 });
assert.deepEqual(calculate(':nth-child()'), { a: 0, b: 1, c: 0 });
assert.deepEqual(calculate(':nth-child(1n)'), { a: 0, b: 1, c: 0 });
assert.deepEqual(calculate(':nth-child(.a)'), { a: 0, b: 1, c: 0 });
assert.deepEqual(calculate(':nth-last-child'), { a: 0, b: 1, c: 0 });
assert.deepEqual(calculate(':nth-last-child()'), { a: 0, b: 1, c: 0 });
assert.deepEqual(calculate(':nth-last-child(1n)'), { a: 0, b: 1, c: 0 });
assert.deepEqual(calculate(':nth-last-child(.a)'), { a: 0, b: 1, c: 0 });

assert.deepEqual(calculate(':nth-of-type'), { a: 0, b: 1, c: 0 });
assert.deepEqual(calculate(':nth-of-type()'), { a: 0, b: 1, c: 0 });
assert.deepEqual(calculate(':nth-of-type(1n)'), { a: 0, b: 1, c: 0 });
assert.deepEqual(calculate(':nth-of-type(.a)'), { a: 0, b: 1, c: 0 });
assert.deepEqual(calculate(':nth-last-of-type'), { a: 0, b: 1, c: 0 });
assert.deepEqual(calculate(':nth-last-of-type()'), { a: 0, b: 1, c: 0 });
assert.deepEqual(calculate(':nth-last-of-type(1n)'), { a: 0, b: 1, c: 0 });
assert.deepEqual(calculate(':nth-last-of-type(.a)'), { a: 0, b: 1, c: 0 });

assert.deepEqual(calculate(':local'), { a: 0, b: 0, c: 0 });
assert.deepEqual(calculate(':local()'), { a: 0, b: 0, c: 0 });
assert.deepEqual(calculate(':local(.a)'), { a: 0, b: 1, c: 0 });
assert.deepEqual(calculate(':global'), { a: 0, b: 0, c: 0 });
assert.deepEqual(calculate(':global()'), { a: 0, b: 0, c: 0 });
assert.deepEqual(calculate(':global(.a)'), { a: 0, b: 1, c: 0 });

assert.deepEqual(calculate(':before'), { a: 0, b: 0, c: 1 });
assert.deepEqual(calculate('::before'), { a: 0, b: 0, c: 1 });

assert.deepEqual(calculate(':focus'), { a: 0, b: 1, c: 0 });

assert.deepEqual(calculate(':is(a + a, b + b + b)'), { a: 0, b: 0, c: 3 });
assert.deepEqual(calculate(':is(.a + .a, .b + .b + .b)'), { a: 0, b: 3, c: 0 });
assert.deepEqual(calculate(':is(#a + #a, #b + #b + #b)'), { a: 3, b: 0, c: 0 });

assert.deepEqual(calculate(':is(a + a + a, b + b)'), { a: 0, b: 0, c: 3 });
assert.deepEqual(calculate(':is(.a + .a + .a, .b + .b)'), { a: 0, b: 3, c: 0 });
assert.deepEqual(calculate(':is(#a + #a + #a, #b + #b)'), { a: 3, b: 0, c: 0 });

assert.deepEqual(calculate(':is(a + a, b + b + b, :is(a + a, b + b + b))'), { a: 0, b: 0, c: 3 });
assert.deepEqual(calculate(':is(.a + .a, .b + .b + .b, :is(.a + .a, .b + .b + .b))'), { a: 0, b: 3, c: 0 });
assert.deepEqual(calculate(':is(#a + #a, #b + #b + #b, :is(#a + #a, #b + #b + #b))'), { a: 3, b: 0, c: 0 });

assert.deepEqual(calculate(':is(a + a + a, b + b + b)'), { a: 0, b: 0, c: 3 });
assert.deepEqual(calculate(':is(.a + .a + .a, .b + .b + .b)'), { a: 0, b: 3, c: 0 });
assert.deepEqual(calculate(':is(#a + #a + #a, #b + #b + #b)'), { a: 3, b: 0, c: 0 });

assert.deepEqual(calculate(':is(.a + .a + a.a, .b + .b + .b)'), { a: 0, b: 3, c: 1 });

assert.deepEqual(calculate(':is(#a + #a + a#a, #b + #b + #b)'), { a: 3, b: 0, c: 1 });
assert.deepEqual(calculate(':is(#a + #a + #a.a, #b + #b + #b)'), { a: 3, b: 1, c: 0 });

assert.deepEqual(calculate(':is(.a + .a + .a, .b + .b + b.b)'), { a: 0, b: 3, c: 1 });

assert.deepEqual(calculate(':is(#a + #a + #a, #b + #b + b#b)'), { a: 3, b: 0, c: 1 });
assert.deepEqual(calculate(':is(#a + #a + #a, #b + #b + #b.b)'), { a: 3, b: 1, c: 0 });
