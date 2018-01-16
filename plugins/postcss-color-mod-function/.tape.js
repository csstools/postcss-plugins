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
		'warn': {
			message: 'supports { unresolved } usage',
			options: {
				unresolved: 'warn'
			},
			warning: 43,
			expect: 'warn.css'
		}
	}
};
