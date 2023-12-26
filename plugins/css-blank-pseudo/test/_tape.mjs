import { declarationClonerPlugin, postcssTape } from '@csstools/postcss-tape';
import plugin from 'css-blank-pseudo';

postcssTape(plugin)({
	'basic': {
		message: 'supports basic usage',
	},
	'basic:replacewith': {
		message: 'supports { replaceWith: ".css-blank" } usage',
		options: {
			replaceWith: '.css-blank',
		},
	},
	'basic:preserve': {
		message: 'supports { preserve: false } usage',
		options: {
			preserve: false,
		},
	},
	'basic:wrong-replacewith': {
		message: 'correctly warns when replace with is invalid',
		warnings: 1,
		options: {
			replaceWith: '#css-blank',
		},
	},
	'basic:disable-polyfill-ready-class': {
		message: 'supports { disablePolyfillReadyClass: true } usage',
		options: {
			disablePolyfillReadyClass: true,
		},
	},
	'basic:with-cloned-declarations': {
		message: 'doesn\'t cause duplicate CSS',
		plugins: [
			declarationClonerPlugin,
			plugin({
				preserve: true,
			}),
		],
	},
	'invalid-selector': {
		message: 'warns on invalid selectors',
		warnings: 1,
	},
	'examples/example': {
		message: 'minimal example',
	},
	'examples/example:preserve-false': {
		message: 'minimal example',
		options: {
			preserve: false,
		},
	},
	'examples/example:replacewith': {
		message: 'minimal example',
		options: {
			replaceWith: '.css-blank',
		},
	},
	'examples/example:disable-polyfill-ready-class': {
		message: 'minimal example',
		options: {
			disablePolyfillReadyClass: true,
		},
	},
	'browser': {
		message: 'css for browser tests',
	},
	'browser:replacewith': {
		message: 'css for browser tests',
		options: {
			replaceWith: '.css-blank',
		},
	},
});
