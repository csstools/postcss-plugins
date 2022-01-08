module.exports = {
	'basic': {
		message: 'supports basic usage'
	},
	'basic:preserve': {
		message: 'supports { preserve: false } usage',
		options: {
			preserve: false
		}
	},
	'basic:specificity-matching-name': {
		message: 'supports { specificityMatchingName: "other-thing-that-does-not-exist" } usage',
		options: {
			specificityMatchingName: 'other-thing-that-does-not-exist'
		}
	},
	'generated-selector-cases': {
		message: 'correctly handles generated cases',
		warnings: 1,
		options: {
			preserve: false
		}
	},
	'browser': {
		message: 'prepare CSS for chrome test',
		options: {
			preserve: false
		}
	},
}
