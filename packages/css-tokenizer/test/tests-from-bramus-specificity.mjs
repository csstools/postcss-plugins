import assert from 'assert';
import { selectorSpecificity } from '@csstools/selector-specificity';
import parser from 'postcss-selector-parser';

function calculate(selector) {
	const selectorAST = parser().astSync(selector);
	return selectorSpecificity(selectorAST);
}

// Copyright (c) 2022 Bramus Van Damme - https://www.bram.us/
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is furnished
// to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
//
// see : https://github.com/bramus/specificity/blob/main/test/index.js

// Examples from the spec
assert.deepEqual(calculate('*'), { a: 0, b: 0, c: 0 }, '* = (0,0,0)');

// Examples from the spec
assert.deepEqual(calculate('li'), { a: 0, b: 0, c: 1 }, 'li = (0,0,1)');
assert.deepEqual(calculate('ul li'), { a: 0, b: 0, c: 2 }, 'ul li = (0,0,2)');
assert.deepEqual(calculate('UL OL+LI '), { a: 0, b: 0, c: 3 }, 'UL OL+LI  = (0,0,3)');
assert.deepEqual(calculate('H1 + *[REL=up]'), { a: 0, b: 1, c: 1 }, 'H1 + *[REL=up] = (0,1,1)');
assert.deepEqual(calculate('UL OL LI.red'), { a: 0, b: 1, c: 3 }, 'UL OL LI.red = (0,1,3)');
assert.deepEqual(calculate('LI.red.level'), { a: 0, b: 2, c: 1 }, 'LI.red.level = (0,2,1)');
assert.deepEqual(calculate('#x34y'), { a: 1, b: 0, c: 0 }, '#x34y = (1,0,0)');
assert.deepEqual(calculate('#s12:not(FOO)'), { a: 1, b: 0, c: 1 }, '#s12:not(FOO) = (1,0,1)');
assert.deepEqual(calculate('.foo :is(.bar, #baz)'), { a: 1, b: 1, c: 0 }, '.foo :is(.bar, #baz) = (1,1,0)');

// Examples by Kilian
assert.deepEqual(calculate('header h1#sitetitle > .logo'), { a: 1, b: 1, c: 2 }, 'header h1#sitetitle > .logo = (1,1,2)');
assert.deepEqual(calculate('ul > li:is(.highlighted, .active)'), { a: 0, b: 1, c: 2 }, 'ul > li:is(.highlighted, .active) = (0,1,2)');
assert.deepEqual(calculate('header:where(#top) nav li:nth-child(2n + 1)'), { a: 0, b: 1, c: 3 }, 'header:where(#top) nav li:nth-child(2n + 1) = (0,1,3)');

// Examples by Kilian, remixed
assert.deepEqual(calculate('header:has(#top) nav li:nth-child(2n + 1)'), { a: 1, b: 1, c: 3 }, 'header:has(#top) nav li:nth-child(2n + 1) = (1,1,3)');
assert.deepEqual(calculate('header:has(#top) nav li:nth-child(2n + 1 of)'), { a: 1, b: 1, c: 3 }, 'header:has(#top) nav li:nth-child(2n + 1 of) = (1,1,3)');
assert.deepEqual(calculate('header:has(#top) nav li:nth-child(2n + 1 of of)'), { a: 1, b: 1, c: 4 }, 'header:has(#top) nav li:nth-child(2n + 1 of of) = (1,1,4)');
assert.deepEqual(calculate('header:has(#top) nav li:nth-child(2n + 1 of .foo)'), { a: 1, b: 2, c: 3 }, 'header:has(#top) nav li:nth-child(2n + 1 of .foo) = (1,2,3)');
assert.deepEqual(calculate('header:has(#top) nav li:nth-child(2n + 1 of .foo, #bar)'), { a: 2, b: 1, c: 3 }, 'header:has(#top) nav li:nth-child(2n + 1 of .foo, #bar) = (2,1,3)');
assert.deepEqual(calculate('header:has(#top) nav li:nth-child(2n + 1 of .foo, #bar, #bar > #baz)'), { a: 3, b: 1, c: 3 }, 'header:has(#top) nav li:nth-child(2n + 1 of .foo, #bar, #bar > #baz) = (3,1,3)');
assert.deepEqual(calculate('header:has(#top) nav li:nth-child(2n + 1 of #bar > #baz, .foo, #bar)'), { a: 3, b: 1, c: 3 }, 'header:has(#top) nav li:nth-child(2n + 1 of #bar > #baz, .foo, #bar) = (3,1,3)');

assert.deepEqual(calculate('header:has(#top) nav li:nth-last-child(2n + 1)'), { a: 1, b: 1, c: 3 }, 'header:has(#top) nav li:nth-last-child(2n + 1) = (1,1,3)');
assert.deepEqual(calculate('header:has(#top) nav li:nth-last-child(2n + 1 of)'), { a: 1, b: 1, c: 3 }, 'header:has(#top) nav li:nth-last-child(2n + 1 of) = (1,1,3)');
assert.deepEqual(calculate('header:has(#top) nav li:nth-last-child(2n + 1 of of)'), { a: 1, b: 1, c: 4 }, 'header:has(#top) nav li:nth-last-child(2n + 1 of of) = (1,1,4)');
assert.deepEqual(calculate('header:has(#top) nav li:nth-last-child(2n + 1 of .foo)'), { a: 1, b: 2, c: 3 }, 'header:has(#top) nav li:nth-last-child(2n + 1 of .foo) = (1,2,3)');
assert.deepEqual(calculate('header:has(#top) nav li:nth-last-child(2n + 1 of .foo, #bar)'), { a: 2, b: 1, c: 3 }, 'header:has(#top) nav li:nth-last-child(2n + 1 of .foo, #bar) = (2,1,3)');
assert.deepEqual(calculate('header:has(#top) nav li:nth-last-child(2n + 1 of .foo, #bar, #bar > #baz)'), { a: 3, b: 1, c: 3 }, 'header:has(#top) nav li:nth-last-child(2n + 1 of .foo, #bar, #bar > #baz) = (3,1,3)');
assert.deepEqual(calculate('header:has(#top) nav li:nth-last-child(2n + 1 of #bar > #baz, .foo, #bar)'), { a: 3, b: 1, c: 3 }, 'header:has(#top) nav li:nth-last-child(2n + 1 of #bar > #baz, .foo, #bar) = (3,1,3)');

// Pseudo-Element Selector = (0,0,1)
assert.deepEqual(calculate('::after'), { a: 0, b: 0, c: 1 }, '::after');
assert.deepEqual(calculate('::cue'), { a: 0, b: 0, c: 1 }, '::cue');
assert.deepEqual(calculate('::before'), { a: 0, b: 0, c: 1 }, '::before');
assert.deepEqual(calculate('::first-line'), { a: 0, b: 0, c: 1 }, '::first-line');
assert.deepEqual(calculate('::first-letter'), { a: 0, b: 0, c: 1 }, '::first-letter');

// Pseudo-Element improperly used as Pseudo-Class Selector = (0,0,1)// @ref https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-elements#index
assert.deepEqual(calculate(':before'), { a: 0, b: 0, c: 1 }, ':before');
assert.deepEqual(calculate(':after'), { a: 0, b: 0, c: 1 }, ':after');
assert.deepEqual(calculate(':first-line'), { a: 0, b: 0, c: 1 }, ':first-line');
assert.deepEqual(calculate(':first-letter'), { a: 0, b: 0, c: 1 }, ':first-letter');

// Pseudo-Class Selector = (0,1,0)
assert.deepEqual(calculate(':hover'), { a: 0, b: 1, c: 0 }, ':hover');
assert.deepEqual(calculate(':focus'), { a: 0, b: 1, c: 0 }, ':focus');

// CSS :is() - :matches() - :any() = Specificity of the most specific complex selector in its selector list argument
assert.deepEqual(calculate(':is(#foo, .bar, baz)'), { a: 1, b: 0, c: 0 }, ':is(#foo, .bar, baz) = (1,0,0)');
assert.deepEqual(calculate(':matches(#foo, .bar, baz)'), { a: 1, b: 0, c: 0 }, ':matches(#foo, .bar, baz) = (1,0,0)');
assert.deepEqual(calculate(':any(#foo, .bar, baz)'), { a: 1, b: 0, c: 0 }, ':any(#foo, .bar, baz) = (1,0,0)');
assert.deepEqual(calculate(':-moz-any(#foo, .bar, baz)'), { a: 1, b: 0, c: 0 }, ':-moz-any(#foo, .bar, baz) = (1,0,0)');
assert.deepEqual(calculate(':-webkit-any(#foo, .bar, baz)'), { a: 1, b: 0, c: 0 }, ':-webkit-any(#foo, .bar, baz) = (1,0,0)');

// CSS :has() = Specificity of the most specific complex selector in its selector list argument
assert.deepEqual(calculate(':has(#foo, .bar, baz)'), { a: 1, b: 0, c: 0 }, ':has(#foo, .bar, baz) = (1,0,0)');

// CSS :not() = Specificity of the most specific complex selector in its selector list argument
assert.deepEqual(calculate(':not(#foo, .bar, baz)'), { a: 1, b: 0, c: 0 }, ':not(#foo, .bar, baz) = (1,0,0)');

// CSS :where() = Replaced by zero
assert.deepEqual(calculate(':where(#foo, .bar, baz)'), { a: 0, b: 0, c: 0 }, ':where(#foo, .bar, baz) = (0,0,0)');

// Namespaced Selectors// @ref https://developer.mozilla.org/en-US/docs/Web/CSS/Type_selectors#namespaces
assert.deepEqual(calculate('ns|*'), { a: 0, b: 0, c: 0 }, 'ns|* = (0,0,0)');
assert.deepEqual(calculate('ns|a'), { a: 0, b: 0, c: 1 }, 'ns|a = (0,0,1)');

// Calculate accepts an empty value
assert.deepEqual(calculate(''), { a: 0, b: 0, c: 0 }, '"" = (0,0,0)');
