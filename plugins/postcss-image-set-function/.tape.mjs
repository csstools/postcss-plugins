import postcssTape from '../../packages/postcss-tape/dist/index.mjs';
import plugin from 'postcss-image-set-function';

postcssTape(plugin)({
	'basic': {
		message: 'supports basic usage',
	},
	'basic:no-preserve': {
		message: 'supports { preserve: false } usage',
		options: {
			preserve: false
		}
	},
	'invalid': {
		message: 'ignores invalid usage',
		expect: 'invalid.css',
		result: 'invalid.css'
	},
	'invalid:warn': {
		message: 'warns invalid usage when { onvalid: "warn" }',
		options: {
			oninvalid: 'warn'
		},
		expect: 'invalid.css',
		result: 'invalid.css',
		warnings: 9
	},
	'invalid:throw': {
		message: 'throws invalid usage when { onvalid: "throw" }',
		options: {
			oninvalid: 'throw'
		},
		expect: 'invalid.css',
		result: 'invalid.css',
		exception: /unexpected image/
	},
	'generated-value-cases': {
		message: 'correctly handles generated cases',
		options: {
			preserve: false
		}
	},
	'generated-value-cases:preserve': {
		message: 'correctly handles generated cases',
		options: {
			preserve: true
		}
	},
});
