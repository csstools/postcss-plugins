import { postcssTape } from '@csstools/postcss-tape';
import plugin from '@csstools/postcss-media-queries-aspect-ratio-number-values';

postcssTape(plugin)({
	basic: {
		message: 'supports basic usage',
	},
	'basic:preserve-true': {
		message: 'supports basic usage',
		options: {
			preserve: true,
		},
	},
	'invalid': {
		message: 'ignores invalid values',
	},
	'examples/example': {
		message: 'minimal example',
	},
	'examples/example:preserve-true': {
		message: 'minimal example',
		options: {
			preserve: true,
		},
	},
});
