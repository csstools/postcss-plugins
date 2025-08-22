import { postcssTape } from '@csstools/postcss-tape';
import plugin from '@csstools/postcss-alpha-function';

postcssTape(plugin)({
	'basic': {
		message: 'supports basic usage',
	},
	'basic:preserve-true': {
		message: 'supports { preserve: true } usage',
		options: {
			preserve: true,
		},
	},
	'variables': {
		message: 'supports variables',
	},
	'variables:preserve-true': {
		message: 'supports variables with { preserve: true } usage',
		options: {
			preserve: true,
		},
	},
	'variables:preserve-true:progressive-false': {
		message: 'supports variables with { preserve: true, enableProgressiveCustomProperties: false } usage',
		options: {
			preserve: true,
			enableProgressiveCustomProperties: false,
		},
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
	'examples/example:preserve-true:progressive-false': {
		message: 'minimal example',
		options: {
			preserve: true,
			enableProgressiveCustomProperties: false,
		},
	},
});
