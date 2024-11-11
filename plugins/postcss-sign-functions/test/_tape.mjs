import { postcssTape } from '@csstools/postcss-tape';
import plugin from '@csstools/postcss-sign-functions';

postcssTape(plugin)({
	basic: {
		message: 'supports basic usage',
	},
	'basic:preserve-false': {
		message: 'supports { preserve: false } usage',
		options: {
			preserve: false,
		},
	},
	'examples/example': {
		message: 'minimal example',
	},
	'examples/example:preserve-false': {
		message: 'minimal example',
		options: {
			preserve: false,
		},
	},
});
