import postcssTape from '../../packages/postcss-tape/dist/index.mjs';
import plugin from 'postcss-lab-function';

postcssTape(plugin)({
	'basic': {
		message: 'supports basic usage',
	},
	'basic:preserve-true': {
		message: 'supports { preserve: true } usage',
		warnings: 9,
		options: {
			preserve: true
		}
	},
	'basic:display-p3-false': {
		message: 'supports { subFeatures: { displayP3: false } } usage',
		options: {
			subFeatures: {
				displayP3: false
			}
		}
	},
	'basic:display-p3-false:preserve-true': {
		message: 'supports { subFeatures: { displayP3: false }, preserve: true } usage',
		warnings: 9,
		options: {
			subFeatures: {
				displayP3: false
			},
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
	'variables:display-p3-false': {
		message: 'supports variables with { displayP3: false } usage',
		options: {
			subFeatures: {
				displayP3: false
			}
		}
	},
	'variables:display-p3-false:preserve-true': {
		message: 'supports variables with { subFeatures: { displayP3: false }, preserve: true } usage',
		options: {
			subFeatures: {
				displayP3: false
			},
			preserve: true
		}
	}
});
