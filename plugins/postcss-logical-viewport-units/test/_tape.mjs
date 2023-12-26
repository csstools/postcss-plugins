import { postcssTape, ruleClonerPlugin } from '@csstools/postcss-tape';
import plugin from '@csstools/postcss-logical-viewport-units';

postcssTape(plugin)({
	basic: {
		message: 'supports basic usage',
	},
	'basic:hebrew': {
		message: 'supports { inlineDirection: \'right-to-left\' }',
		options: {
			inlineDirection: 'right-to-left',
		},
	},
	'basic:vertical': {
		message: 'supports { inlineDirection: \'top-to-bottom\' }',
		options: {
			inlineDirection: 'top-to-bottom',
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
	'examples/example:vertical': {
		message: 'minimal example',
		options: {
			inlineDirection: 'top-to-bottom',
		},
	},
	'examples/example:preserve-false': {
		message: 'minimal example',
		options: {
			preserve: false,
		},
	},
});
