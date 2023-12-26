import { declarationClonerPlugin, postcssTape } from '@csstools/postcss-tape';
import plugin from 'postcss-focus-within';

postcssTape(plugin)({
	'basic': {
		message: 'supports basic usage',
	},
	'basic:replacewith': {
		message: 'supports { replaceWith: ".focus-within" } usage',
		options: {
			replaceWith: '.focus-within',
		},
	},
	'basic:disable-polyfill-ready-class': {
		message: 'supports { disablePolyfillReadyClass: true } usage',
		options: {
			disablePolyfillReadyClass: true,
		},
	},
	'basic:preserve': {
		message: 'supports { preserve: false } usage',
		options: {
			preserve: false,
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
	'generated-selector-cases': {
		message: 'correctly handles generated cases',
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
			replaceWith: '.focus-within',
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
			replaceWith: '.focus-within',
		},
	},
});
