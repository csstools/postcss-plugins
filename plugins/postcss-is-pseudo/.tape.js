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
	'basic:does-not-exist': {
		message: "supports basic usage with { specificityMatchingName: 'something-random' }",
		options: {
			specificityMatchingName: 'something-random'
		}
	},
	'basic:oncomplex:warning': {
		message: "supports basic usage with { onComplexSelector: 'warning' }",
		warnings: 3,
		options: {
			onComplexSelector: 'warning'
		}
	},
	'basic:oncomplex:skip': {
		message: "supports basic usage with { onComplexSelector: 'skip' }",
		options: {
			onComplexSelector: 'skip'
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
