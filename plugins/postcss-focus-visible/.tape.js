module.exports = {
	'postcss-focus-visible': {
		'basic': {
			message: 'supports basic usage'
		},
		'basic:replacewith': {
			message: 'supports { replaceWith: "[focus-visible]" } usage',
			options: {
				replaceWith: '[focus-visible]'
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
