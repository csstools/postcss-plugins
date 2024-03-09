import { promises as fsp } from 'fs';
import { colorMatchers, hslMatchers, hwbMatchers, labMatchers, lchMatchers, oklabMatchers, oklchMatchers, rgbMatchers } from './color.mjs';
import { colorMixMatchers } from './color-mix.mjs';
import { icUnitMatchers } from './font-size.mjs';
import { lightDarkMatchers } from './light-dark.mjs';
import { relativeColorSyntaxMatches } from './relative-color-syntax.mjs';

fsp.writeFile(
	'./src/matchers.ts',
	'export const matchers = ' + JSON.stringify(
		[
			// color mix:
			...colorMixMatchers,

			// relative color syntax:
			...relativeColorSyntaxMatches,

			// color:
			...colorMatchers,
			...hslMatchers,
			...hwbMatchers,
			...labMatchers,
			...lchMatchers,
			...oklabMatchers,
			...oklchMatchers,
			...rgbMatchers,
			...lightDarkMatchers,

			// font-size:
			...icUnitMatchers,
		],
		null,
		'\t',
	),
);
