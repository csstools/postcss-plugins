import postcssTape from '../../packages/postcss-tape/dist/index.mjs';
import plugin from 'postcss-focus-visible';

postcssTape(plugin)({
	'basic': {
		message: 'supports basic usage'
	},
	'basic:replacewith': {
		message: 'supports { replaceWith: "[focus-visible]" } usage',
		options: {
			replaceWith: '[data-focus-visible-added]'
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
	'browser': {
		message: 'css for browser tests',
	},
	'examples/example': {
		message: 'minimal example',
	},
	'examples/example:preserve-false': {
		message: 'minimal example',
		options: {
			preserve: false
		}
	},
	'examples/example:replacewith': {
		message: 'minimal example',
		options: {
			replaceWith: '[focus-visible]'
		}
	},
});
