module.exports = {
	'basic': {
		message: 'supports basic usage'
	},
	'basic:preserve': {
		message: 'supports { preserve: false } usage',
		options: { preserve: false }
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
};
