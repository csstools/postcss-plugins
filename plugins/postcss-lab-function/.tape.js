module.exports = {
	'basic': {
		message: 'supports basic usage',
		warnings: 2,
	},
	'basic:preserve-true': {
		message: 'supports { preserve: true } usage',
		warnings: 2,
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
	}
}
