import assert from 'assert';
import { selectorSpecificity } from '@csstools/selector-specificity';
import parser from 'postcss-selector-parser';

function calculate(selector) {
	const selectorAST = parser().astSync(selector);
	return selectorSpecificity(selectorAST);
}

// The MIT License (MIT)
// Copyright (c) 2016 Keegan Street and others
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//
// see : https://github.com/keeganstreet/specificity/blob/master/test/test.js

// http://css-tricks.com/specifics-on-css-specificity/
assert.deepEqual(calculate('ul#nav li.active a'), { a: 1, b: 1, c: 3 });
assert.deepEqual(calculate('body.ie7 .col_3 h2 ~ h2'), { a: 0, b: 2, c: 3 });
assert.deepEqual(calculate('#footer *:not(nav) li'), { a: 1, b: 0, c: 2 });
assert.deepEqual(calculate('ul > li ul li ol li:first-letter'), { a: 0, b: 0, c: 7 });

// http://reference.sitepoint.com/css/specificity
assert.deepEqual(calculate('body#home div#warning p.message'), { a: 2, b: 1, c: 3 });
assert.deepEqual(calculate('* body#home>div#warning p.message'), { a: 2, b: 1, c: 3 });
assert.deepEqual(calculate('#home #warning p.message'), { a: 2, b: 1, c: 1 });
assert.deepEqual(calculate('#warning p.message'), { a: 1, b: 1, c: 1 });
assert.deepEqual(calculate('#warning p'), { a: 1, b: 0, c: 1 });
assert.deepEqual(calculate('p.message'), { a: 0, b: 1, c: 1 });
assert.deepEqual(calculate('p'), { a: 0, b: 0, c: 1 });

// Test pseudo-element with uppertestCase letters
assert.deepEqual(calculate('li:bEfoRE'), { a: 0, b: 0, c: 2 });

// Pseudo-class tests
assert.deepEqual(calculate('li:first-child+p'), { a: 0, b: 1, c: 2 });
assert.deepEqual(calculate('li:nth-child(even)+p'), { a: 0, b: 1, c: 2 });
assert.deepEqual(calculate('li:nth-child(2n+1)+p'), { a: 0, b: 1, c: 2 });
assert.deepEqual(calculate('li:nth-child( 2n + 1 )+p'), { a: 0, b: 1, c: 2 });
assert.deepEqual(calculate('li:nth-child(2n-1)+p'), { a: 0, b: 1, c: 2 });
assert.deepEqual(calculate('li:nth-child(2n-1) p'), { a: 0, b: 1, c: 2 });
assert.deepEqual(calculate(':lang(nl-be)'), { a: 0, b: 1, c: 0 });

// Tests with CSS escape sequences
// https://mathiasbynens.be/notes/css-escapes and https://mathiasbynens.be/demo/crazy-class
assert.deepEqual(calculate('.\\3A -\\)'), { a: 0, b: 1, c: 0 });             /* <p class=":-)"></p> */
assert.deepEqual(calculate('.\\3A \\`\\('), { a: 0, b: 1, c: 0 });           /* <p class=":`("></p> */
assert.deepEqual(calculate('.\\3A .\\`\\('), { a: 0, b: 2, c: 0 });          /* <p class=": `("></p> */
assert.deepEqual(calculate('.\\31 a2b3c'), { a: 0, b: 1, c: 0 });            /* <p class="1a2b3c"></p> */
assert.deepEqual(calculate('.\\000031a2b3c'), { a: 0, b: 1, c: 0 });         /* <p class="1a2b3c"></p> */
// assert.deepEqual(calculate('.\\000031 a2b3c'), { a: 0, b: 1, c: 0 });        /* <p class="1a2b3c"></p> */
assert.deepEqual(calculate('#\\#fake-id'), { a: 1, b: 0, c: 0 });            /* <p id="#fake-id"></p> */
assert.deepEqual(calculate('.\\#fake-id'), { a: 0, b: 1, c: 0 });            /* <p class="#fake-id"></p> */
assert.deepEqual(calculate('#\\<p\\>'), { a: 1, b: 0, c: 0 });               /* <p id="<p>"></p> */
assert.deepEqual(calculate('.\\#\\.\\#\\.\\#'), { a: 0, b: 1, c: 0 });       /* <p class="#.#.#"></p> */
assert.deepEqual(calculate('.foo\\.bar'), { a: 0, b: 1, c: 0 });             /* <p class="foo.bar"></p> */
assert.deepEqual(calculate('.\\:hover\\:active'), { a: 0, b: 1, c: 0 });     /* <p class=":hover:active"></p> */
assert.deepEqual(calculate('.\\3A hover\\3A active'), { a: 0, b: 1, c: 0 }); /* <p class=":hover:active"></p> */
assert.deepEqual(calculate('.\\000031  p'), { a: 0, b: 1, c: 1 });           /* <p class="1"><p></p></p>" */
assert.deepEqual(calculate('.\\3A \\`\\( .another'), { a: 0, b: 2, c: 0 });  /* <p class=":`("><p class="another"></p></p> */
assert.deepEqual(calculate('.\\--cool'), { a: 0, b: 1, c: 0 });              /* <p class="--cool"></p> */
assert.deepEqual(calculate('#home .\\[page\\]'), { a: 1, b: 1, c: 0 });      /* <p id="home"><p class="[page]"></p></p> */

// Test repeated IDs
// https://github.com/keeganstreet/specificity/issues/29
assert.deepEqual(calculate('ul#nav#nav-main li.active a'), { a: 2, b: 1, c: 3 });

// Test CSS Modules https://github.com/css-modules/css-modules
// Whilst they are not part of the CSS spec, this calculator can support them without breaking results for standard selectors
assert.deepEqual(calculate('.root :global .text'), { a: 0, b: 2, c: 0 });
assert.deepEqual(calculate('.localA :global .global-b :local(.local-c) .global-d'), { a: 0, b: 4, c: 0 });
assert.deepEqual(calculate('.localA :global .global-b .global-c :local(.localD.localE) .global-d'), { a: 0, b: 6, c: 0 });
assert.deepEqual(calculate('.localA :global(.global-b) .local-b'), { a: 0, b: 3, c: 0 });
assert.deepEqual(calculate(':local(:nth-child(2n) .test)'), { a: 0, b: 2, c: 0 });
