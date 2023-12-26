import { postcssTape, ruleClonerPlugin } from '@csstools/postcss-tape';
import plugin from '@csstools/postcss-gradients-interpolation-method';

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
	'basic:with-cloned-rules': {
		message: 'doesn\'t cause duplicate CSS',
		plugins: [
			ruleClonerPlugin,
			plugin({
				preserve: true,
			}),
		],
	},
	'variables': {
		message: 'supports variables',
	},
	'variables:preserve-false': {
		message: 'supports variables with { preserve: false } usage',
		options: {
			preserve: false,
		},
	},
	'variables:preserve-true': {
		message: 'supports { preserve: true, enableProgressiveCustomProperties: true } usage',
	},
	'variables:preserve-true:progressive-false': {
		message: 'supports { preserve: true, enableProgressiveCustomProperties: false } usage',
		options: {
			preserve: true,
			enableProgressiveCustomProperties: false,
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
	'examples/example:progressive-false': {
		message: 'minimal example',
		options: {
			enableProgressiveCustomProperties: false,
		},
	},
});
