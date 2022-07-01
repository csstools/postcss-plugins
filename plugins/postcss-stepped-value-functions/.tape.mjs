import postcssTape from '../../packages/postcss-tape/dist/index.mjs';
import plugin from '@csstools/postcss-stepped-value-functions';

postcssTape(plugin)({
	basic: {
		message: "supports basic usage",
	},
	'basic:on-invalid-warn': {
		message: 'supports { onInvalid: "warn" } usage',
		options: {
			onInvalid: 'warn'
		},
		warnings: 11,
	},
	'basic:preserve-true': {
		message: 'supports { preserve: true } usage',
		options: {
			preserve: true
		},
	},
	'examples/example': {
		message: 'minimal example',
	},
	'examples/example:preserve-true': {
		message: 'minimal example',
		options: {
			preserve: true
		}
	}
});
