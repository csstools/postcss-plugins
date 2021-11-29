module.exports = {
	'basic': {
		message: 'supports basic usage',
		warnings: 1,
	},
	'basic:preserve-true': {
		message: 'supports { preserve: true } usage',
		warnings: 1,
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
