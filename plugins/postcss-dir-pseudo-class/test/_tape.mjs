import { declarationClonerPlugin, postcssTape } from '@csstools/postcss-tape';
import plugin from 'postcss-dir-pseudo-class';

postcssTape(plugin)({
	basic: {
		message: 'supports basic usage',
		warnings: 2,
	},
	'basic:dir': {
		message: 'supports { dir: "ltr" } usage',
		source: 'basic.css',
		warnings: 2,
		options: {
			dir: 'ltr',
		},
	},
	'basic:preserve': {
		message: 'supports { preserve: true } usage',
		source: 'basic.css',
		warnings: 2,
		options: {
			preserve: true,
		},
	},
	'basic:shadow': {
		message: 'support { shadow: true } usage',
		source: 'basic.css',
		warnings: 2,
		options: {
			shadow: true,
		},
	},
	'basic:with-cloned-declarations': {
		message: 'doesn\'t cause duplicate CSS',
		warnings: 2,
		plugins: [
			declarationClonerPlugin,
			plugin({
				preserve: true,
			}),
		],
	},
	'generated-selector-cases': {
		message: 'correctly handles generated cases',
		warnings: 38,
		options: {
			preserve: false,
		},
	},
	'examples/example': {
		message: 'supports examples',
	},
	'examples/example:preserve-true': {
		message: 'supports examples with { preserve: true }',
		options: {
			preserve: true,
		},
	},
	'examples/example:shadow-true': {
		message: 'supports examples with { shadow: true }',
		options: {
			shadow: true,
		},
	},
	'examples/example:dir-ltr': {
		message: 'supports examples with { dir: \'ltr\' }',
		options: {
			dir: 'ltr',
		},
	},
	'examples/example:dir-rtl': {
		message: 'supports examples with { dir: \'rtl\' }',
		options: {
			dir: 'rtl',
		},
	},
});
