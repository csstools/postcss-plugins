import postcssTape from '../../packages/postcss-tape/dist/index.mjs';
import plugin from 'postcss-focus-within';

postcssTape(plugin)({
	'basic': {
		message: 'supports basic usage'
	},
	'basic:replacewith': {
		message: 'supports { replaceWith: ".focus-within" } usage',
		options: {
			replaceWith: '.focus-within'
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
			replaceWith: '.css-blank'
		}
	},
	'browser': {
		message: 'css for browser tests',
	},
	'browser:replacewith': {
		message: 'css for browser tests',
		options: {
			replaceWith: '.css-blank'
		}
	},
});
