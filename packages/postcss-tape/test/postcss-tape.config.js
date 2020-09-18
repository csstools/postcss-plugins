module.exports = {
	'basic': {
		message: 'supports basic usage',
	},
	'basic:generate': {
		message: 'supports generating all files',
		after() {
			require('fs').unlinkSync('test/basic.generate.result.css')
		},
	},
	'basic:sources': {
		message: 'supports specifying files',
		source: 'basic.css',
		expect: 'basic.custom-expect.css',
		result: 'basic.custom-result.css',
		after() {
			require('fs').unlinkSync('test/basic.custom-result.css')
		},
	},
	'basic:error': {
		message: 'supports failing',
		options: {
			shouldFail: true,
		},
		error: {
			message: /should fail/,
		},
	},
	'basic:warnings': {
		message: 'supports warnings',
		options: {
			shouldWarn: true,
		},
		warnings: {
			text: /should warn/,
		},
		after() {
			require('fs').unlinkSync('test/basic.warnings.result.css')
		},
	},
}
