import postcssTape from '../../packages/postcss-tape/dist/index.mjs';
import plugin from '@csstools/postcss-oklab-function';

postcssTape(plugin)({
	'basic': {
		message: 'supports basic usage',
	},
	'basic:preserve-true': {
		message: 'supports { preserve: true } usage',
		warnings: 0,
		options: {
			preserve: true
		}
	},
	'basic:preserve-true:display-p3-false': {
		message: 'supports { subFeatures: { displayP3: false }, preserve: true } usage',
		warnings: 0,
		options: {
			preserve: true,
			subFeatures: {
				displayP3: false
			}
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
	'variables:preserve-true:display-p3-false': {
		message: 'supports variables with { subFeatures: { displayP3: false }, preserve: true } usage',
		options: {
			preserve: true,
			subFeatures: {
				displayP3: false
			}
		}
	}
});
