import postcssTape from '../../packages/postcss-tape/dist/index.mjs';
import plugin from '@csstools/postcss-ic-unit';

postcssTape(plugin)({
	basic: {
		message: "supports basic usage",
	},
	'basic:preserve-true': {
		message: 'supports { preserve: true } usage',
		options: {
			preserve: true
		}
	},
	'variables': {
		message: 'supports variables',
	},
	'variables:preserve-true': {
		message: 'supports variables with { preserve: true } usage',
		options: {
			preserve: true
		}
	},
	'variables:preserve-true:progressive-false': {
		message: 'supports variables with { preserve: true, enableProgressiveCustomProperties: false } usage',
		options: {
			preserve: true,
			enableProgressiveCustomProperties: false,
		}
	},
});
