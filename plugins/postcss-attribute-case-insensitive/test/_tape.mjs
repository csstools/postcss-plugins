import { declarationClonerPlugin, postcssTape } from '@csstools/postcss-tape';
import plugin from 'postcss-attribute-case-insensitive';

postcssTape(plugin)({
	basic: {
		message: 'supports basic usage',
	},
	'basic:preserve-true': {
		message: 'supports { preserve: true } usage',
		options: {
			preserve: true,
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
	'examples/example:preserve-true': {
		message: 'minimal example',
		options: {
			preserve: true,
		},
	},
});
