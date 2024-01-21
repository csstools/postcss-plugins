import { declarationClonerPlugin, postcssTape } from '@csstools/postcss-tape';
import plugin from 'css-prefers-color-scheme';

postcssTape(plugin, { skipPackageNameCheck: true })({
	'basic': {
		message: 'supports basic usage',
	},
	'basic:preserve': {
		message: 'supports { preserve: true } usage',
		options: {
			preserve: true,
		},
	},
	'basic:preserve:false': {
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
	'examples/example': {
		message: 'minimal example',
	},
	'examples/example:preserve-false': {
		message: 'minimal example',
		options: {
			preserve: false,
		},
	},
	'browser': {
		message: 'css for browser tests',
	},
});
