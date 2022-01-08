import { strict as assert } from 'assert';
import encodeCSS from './encode.mjs';
import decodeCSS from './decode.mjs';
import extractEncodedSelectors from './extract.mjs';

function testEncoderDecoder(decoded, encoded) {
	assert.strictEqual(encodeCSS(decoded), encoded);
	assert.strictEqual(decodeCSS(encoded), decoded);

	assert.strictEqual(decodeCSS(encodeCSS(decoded)), decoded);
	assert.strictEqual(encodeCSS(decodeCSS(encoded)), encoded);

	assert.strictEqual(decodeCSS(encodeCSS(decodeCSS(encodeCSS(decoded)))), decoded);

	assert.strictEqual(decodeCSS(decodeCSS(encodeCSS(encodeCSS(decoded)))), decoded);
}

testEncoderDecoder(
	'',
	'',
);

testEncoderDecoder(
	':has()',
	'\\:has\\(\\)',
);

testEncoderDecoder(
	':has( )',
	'\\:has\\(\\%20\\)',
);

testEncoderDecoder(
	':has(*)',
	'\\:has\\(\\*\\)',
);

testEncoderDecoder(
	':has(:focus)',
	'\\:has\\(\\:focus\\)',
);

testEncoderDecoder(
	':has(~ p)',
	'\\:has\\(\\~\\%20p\\)',
);

testEncoderDecoder(
	':has(> p)',
	'\\:has\\(\\%3E\\%20p\\)',
);

testEncoderDecoder(
	':has(+ p)',
	'\\:has\\(\\%2B\\%20p\\)',
);

testEncoderDecoder(
	':has(\\~ p)',
	'\\:has\\(\\%5C\\~\\%20p\\)',
);

testEncoderDecoder(
	':has(\\> p)',
	'\\:has\\(\\%5C\\%3E\\%20p\\)',
);

testEncoderDecoder(
	':has(\\+ p)',
	'\\:has\\(\\%5C\\%2B\\%20p\\)',
);

testEncoderDecoder(
	':has(\\,\\(\\)\\[\\]\\:\\. p)\\',
	'\\:has\\(\\%5C\\,\\%5C\\(\\%5C\\)\\%5C\\[\\%5C\\]\\%5C\\:\\%5C\\.\\%20p\\)\\%5C',
);

testEncoderDecoder(
	':has(.esc\\\\\\:aped)',
	'\\:has\\(\\.esc\\%5C\\%5C\\%5C\\:aped\\)',
);

testEncoderDecoder(
	':has(> [a=":has(.x)"]:hover)',
	'\\:has\\(\\%3E\\%20\\[a\\%3D\\%22\\:has\\(\\.x\\)\\%22\\]\\:hover\\)',
);

testEncoderDecoder(
	':has(h1, h2, h3, h4, h5, h6)',
	'\\:has\\(h1\\,\\%20h2\\,\\%20h3\\,\\%20h4\\,\\%20h5\\,\\%20h6\\)',
);

testEncoderDecoder(
	':has(> [\\:has\\(\\%3E\\%20\\.a\\:hover\\)',
	'\\:has\\(\\%3E\\%20\\[\\%5C\\:has\\%5C\\(\\%5C\\%253E\\%5C\\%2520\\%5C\\.a\\%5C\\:hover\\%5C\\)',
);

testEncoderDecoder(
	':has(\\%perc)',
	'\\:has\\(\\%5C\\%25perc\\)',
);

testEncoderDecoder(
	'foo',
	'foo',
);

testEncoderDecoder(
	':has(> [foo="some"])',
	'\\:has\\(\\%3E\\%20\\[foo\\%3D\\%22some\\%22\\]\\)',
);

testEncoderDecoder(
	'#d_main:has(#d_checkbox:checked)>#d_subject',
	'\\%23d_main\\:has\\(\\%23d_checkbox\\:checked\\)\\%3E\\%23d_subject',
);

testEncoderDecoder(
	'#something-complex:has(> #d_checkbox:checked [foo="some"] * + [bar^="[baz]"] ~ a[class~="logo"] :has(~ .foo:is(button, input)))',
	'\\%23something-complex\\:has\\(\\%3E\\%20\\%23d_checkbox\\:checked\\%20\\[foo\\%3D\\%22some\\%22\\]\\%20\\*\\%20\\%2B\\%20\\[bar\\%5E\\%3D\\%22\\[baz\\]\\%22\\]\\%20\\~\\%20a\\[class\\~\\%3D\\%22logo\\%22\\]\\%20\\:has\\(\\~\\%20\\.foo\\:is\\(button\\,\\%20input\\)\\)\\)',
);

function testExtract(encoded, rules) {
	assert.deepStrictEqual(extractEncodedSelectors(encoded), rules);
}

testExtract(
	'',
	[],
);

testExtract(
	'.a, [\\.x\\:has\\(\\%3E\\%20\\.b\\)][\\.x\\:has\\(\\%3E\\%20\\.b\\)]',
	['.x:has(> .b)'],
);

testExtract(
	'[\\.x\\:has\\(\\%3E\\%20\\.b\\)][\\.x\\:has\\(\\%3E\\%20\\.b\\)], a',
	['.x:has(> .b)'],
);

testExtract(
	'[\\.x\\:has\\(\\%3E\\%20\\.a\\)\\%20\\.b][\\.x\\:has\\(\\%3E\\%20\\.a\\)\\%20\\.b][\\.x\\:has\\(\\%3E\\%20\\.a\\)\\%20\\.b]',
	['.x:has(> .a) .b'],
);

testExtract(
	'[\\.x\\:has\\(\\%3E\\%20\\.\\%F0\\%9F\\%A7\\%91\\%F0\\%9F\\%8F\\%BE\\%E2\\%80\\%8D\\%F0\\%9F\\%8E\\%A4\\)][\\.x\\:has\\(\\%3E\\%20\\.\\%F0\\%9F\\%A7\\%91\\%F0\\%9F\\%8F\\%BE\\%E2\\%80\\%8D\\%F0\\%9F\\%8E\\%A4\\)]',
	['.x:has(> .🧑🏾‍🎤)'],
);

testExtract(
	'[\\.x\\:has\\(\\%3E\\%20\\.a\\:has\\(\\%20\\%2B\\%20\\.b\\)\\)][\\.x\\:has\\(\\%3E\\%20\\.a\\:has\\(\\%20\\%2B\\%20\\.b\\)\\)][\\.x\\:has\\(\\%3E\\%20\\.a\\:has\\(\\%20\\%2B\\%20\\.b\\)\\)]',
	['.x:has(> .a:has( + .b))'],
);

testExtract(
	'[\\:has\\(\\:focus\\)]',
	[':has(:focus)'],
);

testExtract(
	'[\\:is\\(\\:focus\\)]',
	[],
);

testExtract(
	'[[\\:has\\(\\:focus\\)]]',
	[],
);

testExtract(
	'\\[\\:has\\(\\:focus\\)\\]',
	[],
);

testExtract(
	'[attr="foo"]',
	[],
);

testExtract(
	'[\\.x\\:has\\(\\%3E\\%20\\.a\\)][\\.x\\:has\\(\\%3E\\%20\\.a\\)], [\\.x\\:has\\(\\%3E\\%20\\.b\\)][\\.x\\:has\\(\\%3E\\%20\\.b\\)]',
	['.x:has(> .a)', '.x:has(> .b)'],
);

testExtract(
	'[\\.x\\:has\\(\\%3E\\%20\\.a\\)][\\.x\\:has\\(\\%3E\\%20\\.a\\)][\\.x\\:has\\(\\%3E\\%20\\.b\\)][\\.x\\:has\\(\\%3E\\%20\\.b\\)]',
	['.x:has(> .a)', '.x:has(> .b)'],
);

testExtract(
	'[\\.b_subject\\:has\\(\\.b_descendant\\)][\\.b_subject\\:has\\(\\.b_descendant\\)]',
	['.b_subject:has(.b_descendant)'],
);

testExtract(
	'[foo="\\[\\.b_subject\\:has\\(\\.b_descendant\\)\\]\\[\\.b_subject\\:has\\(\\.b_descendant\\)\\]"]',
	[],
);

testExtract(
	'[foo="[\\.b_subject\\:has\\(\\.b_descendant\\)\\]\\[\\.b_subject\\:has\\(\\.b_descendant\\)]"]',
	[],
);

testExtract(
	'"\\"[\\.b_subject\\:has\\(\\.b_descendant\\)][\\.b_subject\\:has\\(\\.b_descendant\\)]"',
	[],
);

testExtract(
	'"\\""[\\.b_subject\\:has\\(\\.b_descendant\\)][\\.b_subject\\:has\\(\\.b_descendant\\)]',
	['.b_subject:has(.b_descendant)'],
);

testExtract(
	'["[[\\.b_subject\\:has\\(\\.b_descendant\\)][\\.b_subject\\:has\\(\\.b_descendant\\)]]"]',
	[],
);

testExtract(
	'[\\:has\\(\\%3E\\%20\\[foo\\%3D\\%22some\\%22\\]\\)]',
	[':has(> [foo="some"])'],
);

testExtract(
	'"\'\\[\\:has\\(\\:focus\\)\\]',
	[],
);

testExtract(
	'\\["\'\\:has\\(\\:focus\\)\\]',
	[],
);

testExtract(
	'\\:has\\(\\:focus\\)',
	[],
);

testExtract(
	'[:has(:focus)]',
	[':has(:focus)'],
);

testExtract(
	'[:has(:focus)\']\']',
	[':has(:focus)]'],
);

testExtract(
	'[:has(:focus)\'"]\']',
	[':has(:focus)"]'],
);

testExtract(
	'[\'"[\':has(:focus)]',
	['"[:has(:focus)'],
);

testExtract(
	'[:has(:focus)[foo=%22some%22]]',
	[':has(:focus)[foo="some"]'],
);

testExtract(
	'[[:has(:focus)]]',
	[],
);

testExtract(
	'":has(:focus)"',
	[],
);

testExtract(
	'\':has(:focus)\'',
	[],
);

testExtract(
	'[":has(:focus)"]',
	[],
);

testExtract(
	'[\':has(:focus)\']',
	[],
);

testExtract(
	'"\':has(:focus)"\'"',
	[],
);

testExtract(
	'\'":has(:focus)\'"',
	[],
);


testExtract(
	':is(:focus)',
	[],
);

testExtract(
	'[:is(:focus)]',
	[],
);

testExtract(
	'[":is(:focus)"]',
	[],
);

testExtract(
	'[\\%23something-complex\\:has\\(\\%3E\\%20\\%23d_checkbox\\:checked\\%20\\[foo\\%3D\\%22some\\%22\\]\\%20\\*\\%20\\%2B\\%20\\[bar\\%5E\\%3D\\%22\\[baz\\]\\%22\\]\\%20\\~\\%20a\\[class\\~\\%3D\\%22logo\\%22\\]\\%20\\:has\\(\\~\\%20\\.foo\\:is\\(button\\,\\%20input\\)\\)\\)]',
	['#something-complex:has(> #d_checkbox:checked [foo="some"] * + [bar^="[baz]"] ~ a[class~="logo"] :has(~ .foo:is(button, input)))'],
);


// Safari already removes escape sequences in CSS selectors.
// This is most likely a bug in Safari.
testExtract(
	'[.b_subject:has(.b_descendant)][.b_subject:has(.b_descendant)]',
	['.b_subject:has(.b_descendant)'],
);

