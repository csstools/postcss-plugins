import { postcssTape, ruleClonerPlugin } from '@csstools/postcss-tape';
import plugin from '@csstools/postcss-gradients-interpolation-method';

postcssTape(plugin)({
	basic: {
		message: "supports basic usage",
	},
	'basic:preserve-false': {
		message: 'supports { preserve: false } usage',
		options: {
			preserve: false
		}
	},
	'basic:preserve-true:progressive-false': {
		message: 'supports { preserve: true, enableProgressiveCustomProperties: false } usage',
		options: {
			preserve: true,
			enableProgressiveCustomProperties: false,
		}
	},
	'basic:with-cloned-rules': {
		message: 'doesn\'t cause duplicate CSS',
		plugins: [
			ruleClonerPlugin,
			plugin({
				preserve: true
			})
		]
	},
	'variables': {
		message: 'supports variables',
	},
	'variables:preserve-false': {
		message: 'supports variables with { preserve: false } usage',
		options: {
			preserve: false
		}
	},
	'examples/example': {
		message: 'minimal example',
	},
	'examples/example:preserve-true': {
		message: 'minimal example',
		options: {
			preserve: true
		}
	},
	'examples/example:preserve-true:progressive-false': {
		message: 'minimal example',
		options: {
			preserve: true,
			enableProgressiveCustomProperties: false,
		}
	}
});
