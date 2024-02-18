import { postcssTape } from '@csstools/postcss-tape';
import plugin from '@csstools/postcss-light-dark-function';

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
	ignore: {
		message: 'ignores values with fallbacks or guard by @supports',
	},
	variables: {
		message: 'supports css variables',
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
