module.exports = {
	'postcss-tape': {
		'basic': {
			'message': 'supports basic usage'
		},
		'basic:generate': {
			'message': 'supports generating all files',
			'error':   /Expected: \n/
		},
		'basic:sources': {
			'message': 'supports specifying files',
			'source':  'basic.css',
			'expect':  'basic.result.css',
			'result':  'basic.result.css'
		}
	}
};
