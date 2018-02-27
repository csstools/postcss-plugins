module.exports = {
	'postcss-color-mod-function': {
		'basic': {
			message: 'supports basic usage'
		},
		'basic:colors': {
			message: 'supports { stringifier } usage',
			options: {
				stringifier: color => color.toString()
			}
		},
		'basic:transformvars': {
			message: 'supports { transformVars: false } usage',
			options: {
				transformVars: false
			},
			error: {
				reason: 'Expected a color'
			}
		},
		'warn': {
			message: 'supports { unresolved } usage',
			options: {
				unresolved: 'warn'
			},
			warning: 43,
			expect: 'warn.css'
		},
		'hex': {
			message: 'supports hex usage'
		},
	}
};
