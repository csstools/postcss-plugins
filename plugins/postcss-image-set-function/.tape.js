module.exports = {
	'basic': {
		message: 'supports basic usage'
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
		warnings: 10
	},
	'invalid:throw': {
		message: 'throws invalid usage when { onvalid: "throw" }',
		options: {
			oninvalid: 'throw'
		},
		expect: 'invalid.css',
		result: 'invalid.css',
		error: {
			message: /unexpected image/
		}
	}
};
