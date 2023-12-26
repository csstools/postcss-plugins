import { postcssTape, ruleClonerPlugin } from '@csstools/postcss-tape';
import plugin from '@csstools/postcss-nested-calc';

postcssTape(plugin)({
	basic: {
		message: 'supports basic usage',
	},
	'basic:preserve-false': {
		message: 'supports basic usage with { preserve: false }',
		options: {
			preserve: false,
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
	'examples/example': {
		message: 'minimal example',
	},
	'examples/example:preserve-false': {
		message: 'minimal example',
		options: {
			preserve: false,
		},
	},
});
