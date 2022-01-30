module.exports = {
	'basic': {
		message: 'supports basic usage'
	},
	'basic:color': {
		message: 'supports { mediaQuery: "color" } usage',
		options: {
			mediaQuery: 'color'
		}
	},
	'basic:color-index': {
		message: 'supports { mediaQuery: "color-index" } usage',
		options: {
			mediaQuery: 'color-index'
		}
	},
	'basic:preserve': {
		message: 'supports { preserve: true } usage',
		options: {
			preserve: true
		}
	},
	'basic:preserve:false': {
		message: 'supports { preserve: false } usage',
		options: {
			preserve: false
		}
	}
};
