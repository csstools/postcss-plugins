import { postcssTape, ruleClonerPlugin } from '@csstools/postcss-tape';
import plugin from 'postcss-double-position-gradients';

postcssTape(plugin)({
	'basic': {
		message: 'supports basic usage',
	},
	'basic:preserve': {
		message: 'supports { preserve: false } usage',
		options: { preserve: false },
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
});
