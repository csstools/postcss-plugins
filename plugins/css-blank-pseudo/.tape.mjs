import postcssTape from '../../packages/postcss-tape/dist/index.mjs';
import plugin from 'css-blank-pseudo';

postcssTape(plugin)({
	'basic': {
		message: 'supports basic usage',
	},
	'basic:replacewith': {
		message: 'supports { replaceWith: ".css-blank" } usage',
		options: {
			replaceWith: '.css-blank'
		}
	},
	'basic:preserve': {
		message: 'supports { preserve: false } usage',
		options: {
			preserve: false
		}
	},
	'basic:wrong-replacewith': {
		message: 'correctly warns when replace with is invalid',
		warnings: 1,
		options: {
			replaceWith: '#css-blank'
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
