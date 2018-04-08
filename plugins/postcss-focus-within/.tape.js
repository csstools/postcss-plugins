module.exports = {
	'postcss-focus-within': {
		'basic': {
			message: 'supports basic usage'
		},
		'basic:replacewith': {
			message: 'supports { replaceWith: ".focus-within" } usage',
			options: {
				replaceWith: '.focus-within'
			}
		},
		'basic:preserve': {
			message: 'supports { preserve: false } usage',
			options: {
				preserve: false
			}
		}
	}
};
