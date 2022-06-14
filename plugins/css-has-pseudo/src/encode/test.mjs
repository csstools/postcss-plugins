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
	'csstools-has-1m-2w-2p-37-14-15',
);

testEncoderDecoder(
	':has( )',
	'csstools-has-1m-2w-2p-37-14-w-15',
);

testEncoderDecoder(
	':has(*)',
	'csstools-has-1m-2w-2p-37-14-16-15',
);

testEncoderDecoder(
	':has(:focus)',
	'csstools-has-1m-2w-2p-37-14-1m-2u-33-2r-39-37-15',
);

testEncoderDecoder(
	':has(~ p)',
	'csstools-has-1m-2w-2p-37-14-3i-w-34-15',
);

testEncoderDecoder(
	':has(> p)',
	'csstools-has-1m-2w-2p-37-14-1q-w-34-15',
);

testEncoderDecoder(
	':has(+ p)',
	'csstools-has-1m-2w-2p-37-14-17-w-34-15',
);

testEncoderDecoder(
	':has(\\~ p)',
	'csstools-has-1m-2w-2p-37-14-2k-3i-w-34-15',
);

testEncoderDecoder(
	':has(\\> p)',
	'csstools-has-1m-2w-2p-37-14-2k-1q-w-34-15',
);

testEncoderDecoder(
	':has(\\+ p)',
	'csstools-has-1m-2w-2p-37-14-2k-17-w-34-15',
);

testEncoderDecoder(
	':has(\\,\\(\\)\\[\\]\\:\\. p)\\',
	'csstools-has-1m-2w-2p-37-14-2k-18-2k-14-2k-15-2k-2j-2k-2l-2k-1m-2k-1a-w-34-15-2k',
);

testEncoderDecoder(
	':has(.esc\\\\\\:aped)',
	'csstools-has-1m-2w-2p-37-14-1a-2t-37-2r-2k-2k-2k-1m-2p-34-2t-2s-15',
);

testEncoderDecoder(
	':has(> [a=":has(.x)"]:hover)',
	'csstools-has-1m-2w-2p-37-14-1q-w-2j-2p-1p-y-1m-2w-2p-37-14-1a-3c-15-y-2l-1m-2w-33-3a-2t-36-15',
);

testEncoderDecoder(
	':has(h1, h2, h3, h4, h5, h6)',
	'csstools-has-1m-2w-2p-37-14-2w-1d-18-w-2w-1e-18-w-2w-1f-18-w-2w-1g-18-w-2w-1h-18-w-2w-1i-15',
);

testEncoderDecoder(
	':has(> [\\:has\\(\\%3E\\%20\\.a\\:hover\\)',
	'csstools-has-1m-2w-2p-37-14-1q-w-2j-2k-1m-2w-2p-37-2k-14-2k-11-1f-1x-2k-11-1e-1c-2k-1a-2p-2k-1m-2w-33-3a-2t-36-2k-15',
);

testEncoderDecoder(
	':has(\\%perc)',
	'csstools-has-1m-2w-2p-37-14-2k-11-34-2t-36-2r-15',
);

testEncoderDecoder(
	'foo',
	'csstools-has-2u-33-33',
);

testEncoderDecoder(
	':has(> [foo="some"])',
	'csstools-has-1m-2w-2p-37-14-1q-w-2j-2u-33-33-1p-y-37-33-31-2t-y-2l-15',
);

testEncoderDecoder(
	'#d_main:has(#d_checkbox:checked)>#d_subject',
	'csstools-has-z-2s-2n-31-2p-2x-32-1m-2w-2p-37-14-z-2s-2n-2r-2w-2t-2r-2z-2q-33-3c-1m-2r-2w-2t-2r-2z-2t-2s-15-1q-z-2s-2n-37-39-2q-2y-2t-2r-38',
);

testEncoderDecoder(
	'#something-complex:has(> #d_checkbox:checked [foo="some"] * + [bar^="[baz]"] ~ a[class~="logo"] :has(~ .foo:is(button, input)))',
	'csstools-has-z-37-33-31-2t-38-2w-2x-32-2v-19-2r-33-31-34-30-2t-3c-1m-2w-2p-37-14-1q-w-z-2s-2n-2r-2w-2t-2r-2z-2q-33-3c-1m-2r-2w-2t-2r-2z-2t-2s-w-2j-2u-33-33-1p-y-37-33-31-2t-y-2l-w-16-w-17-w-2j-2q-2p-36-2m-1p-y-2j-2q-2p-3e-2l-y-2l-w-3i-w-2p-2j-2r-30-2p-37-37-3i-1p-y-30-33-2v-33-y-2l-w-1m-2w-2p-37-14-3i-w-1a-2u-33-33-1m-2x-37-14-2q-39-38-38-33-32-18-w-2x-32-34-39-38-15-15-15',
);

function testExtract(encoded, rules) {
	assert.deepStrictEqual(extractEncodedSelectors(encoded), rules);
}

testExtract(
	'',
	[],
);

testExtract(
	'.a, [csstools-has-1m-2w-2p-37-14-1q-w-2j-2u-33-33-1p-y-37-33-31-2t-y-2l-15]',
	[':has(> [foo="some"])'],
);

testExtract(
	'[csstools-has-1m-2w-2p-37-14-1q-w-2j-2u-33-33-1p-y-37-33-31-2t-y-2l-15], a',
	[':has(> [foo="some"])'],
);

testExtract(
	'[csstools-has-1m-2w-2p-37-14-1q-w-2j-2u-33-33-1p-y-37-33-31-2t-y-2l-15][csstools-has-1m-2w-2p-37-14-1q-w-2j-2u-33-33-1p-y-37-33-31-2t-y-2l-15][csstools-has-1m-2w-2p-37-14-1q-w-2j-2u-33-33-1p-y-37-33-31-2t-y-2l-15]',
	[':has(> [foo="some"])'],
);

testExtract(
	'[' + encodeCSS('.x:has(> .🧑🏾‍🎤)') +']',
	['.x:has(> .🧑🏾‍🎤)'],
);

testExtract(
	'[' + encodeCSS('.x:has(> .a:has( + .b))') + ']',
	['.x:has(> .a:has( + .b))'],
);
