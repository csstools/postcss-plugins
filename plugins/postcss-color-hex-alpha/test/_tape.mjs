import { postcssTape, ruleClonerPlugin } from '@csstools/postcss-tape';
import plugin from 'postcss-color-hex-alpha';

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
	'basic:with-cloned-rules': {
		message: 'doesn\'t cause duplicate CSS',
		plugins: [
			ruleClonerPlugin,
			plugin({
				preserve: true,
			}),
		],
	},
	'clip-path': {
		message: 'ignores clip-path with hash in url',
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
