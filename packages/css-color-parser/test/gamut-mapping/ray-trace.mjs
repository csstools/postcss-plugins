import { color } from '@csstools/css-color-parser';
import assert from 'node:assert';
import { parse } from '../util/parse.mjs';
import { serialize_sRGB_data } from '../util/serialize.mjs';
import { canonicalize } from '../util/canonical.mjs';

assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('oklch(30% .4 160)'))),
	canonicalize('oklch(0.3 0.06787 160)'),
);

assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('oklch(90% .4 60)'))),
	canonicalize('oklch(0.9 0.06478 60.008)'),
);

assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('oklch(30% .4 10)'))),
	canonicalize('oklch(0.3 0.11997 10)'),
);

assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('oklch(90% .4 150)'))),
	canonicalize('oklch(0.9 0.18156 150)'),
);

assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('oklch(30% .4 100)'))),
	canonicalize('oklch(0.3 0.06237 99.999)'),
);

assert.deepStrictEqual(
	serialize_sRGB_data(color(parse('oklch(90% .4 270)'))),
	canonicalize('oklch(0.9 0.04813 270)'),
);
