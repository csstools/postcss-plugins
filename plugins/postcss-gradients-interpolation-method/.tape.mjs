import postcssTape from '../../packages/postcss-tape/dist/index.mjs';
import plugin from '@csstools/postcss-gradients-interpolation-method';

postcssTape(plugin)({
	basic: {
		message: "supports basic usage",
		warnings: 2,
	},
	'basic:preserve-false': {
		message: 'supports { preserve: false } usage',
		warnings: 2,
		options: {
			preserve: false
		}
	},
	'basic:preserve-true:progressive-false': {
		message: 'supports { preserve: true, enableProgressiveCustomProperties: false } usage',
		warnings: 2,
		options: {
			preserve: true,
			enableProgressiveCustomProperties: false,
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
