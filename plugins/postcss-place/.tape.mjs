import postcssTape from '../../packages/postcss-tape/dist/index.mjs';
import plugin from 'postcss-place';

postcssTape(plugin)({
	'basic': {
		message: 'supports basic usage',
	},
	'basic:preserve-false': {
		message: 'supports { preserve: false } usage',
		options: {
			preserve: false
		}
	},
	'generated-declaration-cases': {
		message: 'correctly handles generated cases',
		options: {
			preserve: false
		}
	},
	'generated-declaration-cases:preserve': {
		message: 'correctly handles generated cases',
		options: {
			preserve: true
		}
	},
});
