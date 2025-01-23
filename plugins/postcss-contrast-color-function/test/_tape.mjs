import { postcssTape } from '@csstools/postcss-tape';
import plugin from '@csstools/postcss-contrast-color-function';

postcssTape(plugin)({
	basic: {
		message: 'supports basic usage',
	},
	'basic:preserve-false': {
		message: 'supports basic usage',
		options: {
			preserve: false,
		},
	},
	'variables': {
		message: 'supports progressive custom properties',
	},
	'variables:preserve-false': {
		message: 'supports progressive custom properties',
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
