import { postcssTape, ruleClonerPlugin } from '@csstools/postcss-tape';
import plugin from 'postcss-color-functional-notation';

postcssTape(plugin)({
	'basic': {
		message: 'supports basic usage',
	},
	'basic:preserve-true': {
		message: 'supports { preserve: true } usage',
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
	'generated-value-cases': {
		message: 'correctly handles generated cases',
		options: {
			preserve: false,
		},
	},
	'generated-value-cases:preserve': {
		message: 'correctly handles generated cases',
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
	'examples/example:preserve-true:progressive-false': {
		message: 'minimal example',
		options: {
			preserve: true,
			enableProgressiveCustomProperties: false,
		},
	},
});
