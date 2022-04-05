import postcssTape from '../../packages/postcss-tape/dist/index.mjs';
import plugin from 'postcss-focus-visible';

postcssTape(plugin)({
	'basic': {
		message: 'supports basic usage'
	},
	'basic:replacewith': {
		message: 'supports { replaceWith: "[focus-visible]" } usage',
		options: {
			replaceWith: '[focus-visible]'
		}
	},
	'basic:preserve': {
		message: 'supports { preserve: false } usage',
		options: {
			preserve: false
		}
	},
	'generated-selector-cases': {
		message: 'correctly handles generated cases',
		warnings: 1,
		options: {
			preserve: false
		}
	},
});
