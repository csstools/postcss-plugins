import { promises as fsp } from 'fs';
import { colorMixMatchers } from './color-mix.mjs';
import { colorMatchers, hslMatchers, hwbMatchers, labMatchers, lchMatchers, oklabMatchers, oklchMatchers, rgbMatchers } from './color.mjs';
import { icUnitMatchers } from './font-size.mjs';

fsp.writeFile(
	'./src/matchers.ts',
	'export const matchers = ' + JSON.stringify(
		[
			// color:
			...colorMatchers,
			...hslMatchers,
			...hwbMatchers,
			...labMatchers,
			...lchMatchers,
			...oklabMatchers,
			...oklchMatchers,
			...rgbMatchers,

			// color mix:
			...colorMixMatchers,

			// font-size:
			...icUnitMatchers,
		],
		null,
		'\t',
	),
);
