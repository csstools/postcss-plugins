module.exports = {
	'basic': {
		message: 'supports basic usage',
	},
	'basic:preserve-true': {
		message: 'supports { preserve: true } usage',
		options: {
			preserve: true
		}
	},
	'variables': {
		message: 'supports variables',
	},
	'variables:preserve-true': {
		message: 'supports variables with { preserve: true } usage',
		options: {
			preserve: true
		}
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
}
