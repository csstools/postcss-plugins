module.exports = {
	basic: {
		message: "supports basic usage",
		options: {
			oncomplex: 'ignore'
		}
	},
	'basic:preserve': {
		message: "supports basic usage with { preserve: true }",
		options: {
			preserve: true
		}
	},
	'basic:oncomplex:warning': {
		message: "supports basic usage with { oncomplex: 'warning' }",
		warnings: 3,
		options: {
			oncomplex: 'warning'
		}
	},
	'basic:oncomplex:skip': {
		message: "supports basic usage with { oncomplex: 'skip' }",
		options: {
			oncomplex: 'skip'
		}
	},
	'generated-selector-class-function-cases': {
		message: "supports generated selector class function cases",
		warnings: 1,
		options: {
			preserve: true
		}
	},
	example: {
		message: "minimal example",
	},
};
