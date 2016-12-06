module.exports = {
	'postcss-pseudo-class-any-link': {
		'basic': {
			message: 'supports basic usage'
		},
		'basic:w-prefix': {
			message: 'ignores basic usage when { prefix: "x" }',
			options: {
				prefix: 'x'
			}
		},
		'prefix': {
			message: 'supports prefix usage'
		},
		'prefix:w-prefix': {
			message: 'supports prefix usage when { prefix: "x" }',
			options: {
				prefix: 'x'
			}
		}
	}
};
