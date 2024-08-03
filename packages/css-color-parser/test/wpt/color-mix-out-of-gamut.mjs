import { color } from '@csstools/css-color-parser';
import assert from 'node:assert';
import { canonicalize } from '../util/canonical.mjs';
import { parse } from '../util/parse.mjs';
import { serialize_sRGB_data } from '../util/serialize.mjs';

const tests = [
	['color-mix(in hsl, color(display-p3 0 1 0) 100%, rgb(0, 0, 0) 0%)', canonicalize('color(srgb -0.511814 1.01832 -0.310726)')],
	['color-mix(in hsl, lab(100 104.3 -50.9) 100%, rgb(0, 0, 0) 0%)', canonicalize('color(srgb 1.59343 0.58802 1.40564)')],
	['color-mix(in hsl, lab(0 104.3 -50.9) 100%, rgb(0, 0, 0) 0%)', canonicalize('color(srgb 0.351376 -0.213938 0.299501)')],
	['color-mix(in hsl, lch(100 116 334) 100%, rgb(0, 0, 0) 0%)', canonicalize('color(srgb 1.59328 0.588284 1.40527)')],
	['color-mix(in hsl, lch(0 116 334) 100%, rgb(0, 0, 0) 0%)', canonicalize('color(srgb 0.351307 -0.213865 0.299236)')],
	['color-mix(in hsl, oklab(1 0.365 -0.16) 100%, rgb(0, 0, 0) 0%)', canonicalize('color(srgb 1.59295 0.360371 1.38571)')],
	['color-mix(in hsl, oklab(0 0.365 -0.16) 100%, rgb(0, 0, 0) 0%)', canonicalize('color(srgb 0.0763893 -0.0456266 0.0932598)')],
	['color-mix(in hsl, oklch(1 0.399 336.3) 100%, rgb(0, 0, 0) 0%)', canonicalize('color(srgb 1.59328 0.358734 1.38664)')],
	['color-mix(in hsl, oklch(0 0.399 336.3) 100%, rgb(0, 0, 0) 0%)', canonicalize('color(srgb 0.076536 -0.045825 0.0937443)')],

	['color-mix(in hwb, color(display-p3 0 1 0) 100%, rgb(0, 0, 0) 0%)', canonicalize('color(srgb -0.511814 1.01832 -0.310726)')],
	['color-mix(in hwb, lab(100 104.3 -50.9) 100%, rgb(0, 0, 0) 0%)', canonicalize('color(srgb 1.59343 0.58802 1.40564)')],
	['color-mix(in hwb, lab(0 104.3 -50.9) 100%, rgb(0, 0, 0) 0%)', canonicalize('color(srgb 0.351376 -0.213938 0.299501)')],
	['color-mix(in hwb, lch(100 116 334) 100%, rgb(0, 0, 0) 0%)', canonicalize('color(srgb 1.59328 0.588284 1.40527)')],
	['color-mix(in hwb, lch(0 116 334) 100%, rgb(0, 0, 0) 0%)', canonicalize('color(srgb 0.351307 -0.213865 0.299236)')],
	['color-mix(in hwb, oklab(1 0.365 -0.16) 100%, rgb(0, 0, 0) 0%)', canonicalize('color(srgb 1.59295 0.360371 1.38571)')],
	['color-mix(in hwb, oklab(0 0.365 -0.16) 100%, rgb(0, 0, 0) 0%)', canonicalize('color(srgb 0.0763893 -0.0456266 0.0932598)')],
	['color-mix(in hwb, oklch(1 0.399 336.3) 100%, rgb(0, 0, 0) 0%)', canonicalize('color(srgb 1.59328 0.358736 1.38664)')],
	['color-mix(in hwb, oklch(0 0.399 336.3) 100%, rgb(0, 0, 0) 0%)', canonicalize('color(srgb 0.0765361 -0.045825 0.0937443)')],
];

for (const test of tests) {
	assert.deepStrictEqual(
		serialize_sRGB_data(color(parse(test[0]))),
		test[1],
		`"${test[0]}" : ${test[1]}`,
	);
}
