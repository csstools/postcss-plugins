module.exports = {
	'postcss-color-hex-alpha': {
		'basic': {
			message: 'supports basic usage'
		},
		'basic:preserve': {
			message: 'supports { preserve: true } usage',
			options: {
				preserve: true
			}
		},
		'clip-path': {
			message: 'ignores clip-path with hash in url'
		}
	}
};
