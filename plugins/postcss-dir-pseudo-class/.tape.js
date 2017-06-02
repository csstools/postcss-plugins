module.exports = {
	'postcss-dir-pseudo-class': {
		'basic': {
			message: 'supports basic usage'
		},
		'basic:dir': {
			message: 'supports { dir: "ltr" } usage',
			source: 'basic.css',
			options: {
				dir: 'ltr'
			}
		},
		'basic:browsers': {
			message: 'supports { browsers: "last 2 versions" } usage',
			source: 'basic.css',
			expect: 'basic.expect.css',
			result: 'basic.result.css',
			options: {
				browsers: 'last 2 versions'
			}
		},
		'basic:supported': {
			message: 'ignores supported { ff >= 49 } usage',
			source: 'basic.css',
			options: {
				browsers: 'ff >= 49'
			}
		}
	}
};
