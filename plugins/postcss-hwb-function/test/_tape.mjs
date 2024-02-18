import { postcssTape, ruleClonerPlugin } from '@csstools/postcss-tape';
import plugin from '@csstools/postcss-hwb-function';

postcssTape(plugin)({
	'basic': {
		message: 'supports basic usage',
	},
	'basic:preserve-true': {
		message: 'supports basic usage with { preserve: true }',
		options: {
			preserve: true,
		},
	},
	'basic:with-cloned-rules': {
		message: 'doesn\'t cause duplicate CSS',
		plugins: [
			ruleClonerPlugin,
			plugin({
				preserve: true,
			}),
		],
	},
	'variables': {
		message: 'supports variables',
	},
	'variables:preserve-true': {
		message: 'supports variables with { preserve: true } usage',
		options: {
			preserve: true,
		},
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
