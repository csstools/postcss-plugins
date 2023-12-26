import { declarationClonerPlugin, postcssTape } from '@csstools/postcss-tape';
import plugin from 'postcss-custom-selectors';

postcssTape(plugin)({
	'basic': {
		message: 'supports basic usage',
	},
	'basic:preserve': {
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
	'cascade-layers': {
		message: 'supports cascade layers',
	},
	'conditionals': {
		message: 'handles conditional rules',
	},
	'invalid-selector': {
		message: 'warns on invalid selectors',
		warnings: 2,
	},
	'examples/example': {
		message: 'minimal example',
	},
	'examples/example:preserve': {
		message: 'minimal example',
		options: {
			preserve: true,
		},
	},
	'complex': {
		message: 'supports complex usage',
	},
	'safety': {
		message: 'supports safe tag ordering (.foo:--h1 becomes h1.foo instead of .fooh1)',
	},
});
