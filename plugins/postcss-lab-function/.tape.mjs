import postcssTape from '../../packages/postcss-tape/dist/index.mjs';
import plugin from 'postcss-lab-function';

postcssTape(plugin)({
	'basic': {
		message: 'supports basic usage',
	},
	'basic:preserve-true': {
		message: 'supports { preserve: true } usage',
		options: {
			preserve: true
		}
	},
	'basic:display-p3': {
		message: 'supports { displayP3: true } usage',
		options: {
			displayP3: true
		}
	},
	'basic:display-p3:preserve-true': {
		message: 'supports { displayP3: true, preserve: true } usage',
		options: {
			displayP3: true,
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
	'variables:display-p3': {
		message: 'supports variables with { displayP3: true } usage',
		options: {
			displayP3: true
		}
	},
	'variables:display-p3:preserve-true': {
		message: 'supports variables with { displayP3: true, preserve: true } usage',
		options: {
			displayP3: true,
			preserve: true
		}
	}
});
