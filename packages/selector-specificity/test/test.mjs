import assert from 'assert';
import selectorSpecificity from '@csstools/selector-specificity';
import parser from 'postcss-selector-parser';

function calculate(selector) {
	const selectorAST = parser().astSync(selector);
	return selectorSpecificity(selectorAST);
}

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
