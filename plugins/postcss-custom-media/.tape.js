module.exports = {
	'basic': {
		message: 'supports basic usage'
	},
	'basic:preserve': {
		message: 'supports { preserve: true } usage',
		options: {
			preserve: true
		}
	},
	'import': {
		message: 'supports { importFrom: { customMedia: { ... } } } usage',
		options: {
			importFrom: {
				customMedia: {
					'--mq-a': '(max-width: 30em), (max-height: 30em)',
					'--not-mq-a': 'not all and (--mq-a)'
				}
			}
		}
	},
	'import:import-fn': {
		message: 'supports { importFrom() } usage',
		options: {
			importFrom() {
				return {
					customMedia: {
						'--mq-a': '(max-width: 30em), (max-height: 30em)',
						'--not-mq-a': 'not all and (--mq-a)'
					}
				};
			}
		},
		expect: 'import.expect.css',
		result: 'import.result.css'
	},
	'import:import-fn-promise': {
		message: 'supports { async importFrom() } usage',
		options: {
			importFrom() {
				return new Promise(resolve => {
					resolve({
						customMedia: {
							'--mq-a': '(max-width: 30em), (max-height: 30em)',
							'--not-mq-a': 'not all and (--mq-a)'
						}
					})
				});
			}
		},
		expect: 'import.expect.css',
		result: 'import.result.css'
	},
	'import:json': {
		message: 'supports { importFrom: "test/import-media.json" } usage',
		options: {
			importFrom: 'test/import-media.json'
		},
		expect: 'import.expect.css',
		result: 'import.result.css'
	},
	'import:js': {
		message: 'supports { importFrom: "test/import-media.js" } usage',
		options: {
			importFrom: 'test/import-media.js'
		},
		expect: 'import.expect.css',
		result: 'import.result.css'
	},
	'import:css': {
		message: 'supports { importFrom: "test/import-media.css" } usage',
		options: {
			importFrom: 'test/import-media.css'
		},
		expect: 'import.expect.css',
		result: 'import.result.css'
	},
	'import:css-from': {
		message: 'supports { importFrom: { from: "test/import-media.css" } } usage',
		options: {
			importFrom: { from: 'test/import-media.css' }
		},
		expect: 'import.expect.css',
		result: 'import.result.css'
	},
	'import:css-from-type': {
		message: 'supports { importFrom: [ { from: "test/import-media.css", type: "css" } ] } usage',
		options: {
			importFrom: [ { from: 'test/import-media.css', type: 'css' } ]
		},
		expect: 'import.expect.css',
		result: 'import.result.css'
	},
	'import:empty': {
		message: 'supports { importFrom: {} } usage',
		options: {
			importFrom: {}
		}
	},
	'basic:export': {
		message: 'supports { exportTo: { customMedia: { ... } } } usage',
		options: {
			exportTo: (global.__exportMediaObject = global.__exportMediaObject || {
				customMedia: null
			})
		},
		expect: 'basic.expect.css',
		result: 'basic.result.css',
		after() {
			if (__exportMediaObject.customMedia['--mq-a'] !== '(max-width: 30em), (max-height: 30em)') {
				throw new Error('The exportTo function failed');
			}
		}
	},
	'basic:export-fn': {
		message: 'supports { exportTo() } usage',
		options: {
			exportTo(customMedia) {
				if (customMedia['--mq-a'] !== '(max-width: 30em), (max-height: 30em)') {
					throw new Error('The exportTo function failed');
				}
			}
		},
		expect: 'basic.expect.css',
		result: 'basic.result.css'
	},
	'basic:export-fn-promise': {
		message: 'supports { async exportTo() } usage',
		options: {
			exportTo(customMedia) {
				return new Promise((resolve, reject) => {
					if (customMedia['--mq-a'] !== '(max-width: 30em), (max-height: 30em)') {
						reject('The exportTo function failed');
					} else {
						resolve();
					}
				});
			}
		},
		expect: 'basic.expect.css',
		result: 'basic.result.css'
	},
	'basic:export-json': {
		message: 'supports { exportTo: "test/export-media.json" } usage',
		options: {
			exportTo: 'test/export-media.json'
		},
		expect: 'basic.expect.css',
		result: 'basic.result.css',
		before() {
			global.__exportMediaString = require('fs').readFileSync('test/export-media.json', 'utf8');
		},
		after() {
			if (global.__exportMediaString !== require('fs').readFileSync('test/export-media.json', 'utf8')) {
				throw new Error('The original file did not match the freshly exported copy');
			}
		}
	},
	'basic:export-js': {
		message: 'supports { exportTo: "test/export-media.js" } usage',
		options: {
			exportTo: 'test/export-media.js'
		},
		expect: 'basic.expect.css',
		result: 'basic.result.css',
		before() {
			global.__exportMediaString = require('fs').readFileSync('test/export-media.js', 'utf8');
		},
		after() {
			if (global.__exportMediaString !== require('fs').readFileSync('test/export-media.js', 'utf8')) {
				throw new Error('The original file did not match the freshly exported copy');
			}
		}
	},
	'basic:export-mjs': {
		message: 'supports { exportTo: "test/export-media.mjs" } usage',
		options: {
			exportTo: 'test/export-media.mjs'
		},
		expect: 'basic.expect.css',
		result: 'basic.result.css',
		before() {
			global.__exportMediaString = require('fs').readFileSync('test/export-media.mjs', 'utf8');
		},
		after() {
			if (global.__exportMediaString !== require('fs').readFileSync('test/export-media.mjs', 'utf8')) {
				throw new Error('The original file did not match the freshly exported copy');
			}
		}
	},
	'basic:export-css': {
		message: 'supports { exportTo: "test/export-media.css" } usage',
		options: {
			exportTo: 'test/export-media.css'
		},
		expect: 'basic.expect.css',
		result: 'basic.result.css',
		before() {
			global.__exportMediaString = require('fs').readFileSync('test/export-media.css', 'utf8');
		},
		after() {
			if (global.__exportMediaString !== require('fs').readFileSync('test/export-media.css', 'utf8')) {
				throw new Error('The original file did not match the freshly exported copy');
			}
		}
	},
	'basic:export-css-to': {
		message: 'supports { exportTo: { to: "test/export-media.css" } } usage',
		options: {
			exportTo: { to: 'test/export-media.css' }
		},
		expect: 'basic.expect.css',
		result: 'basic.result.css',
		before() {
			global.__exportMediaString = require('fs').readFileSync('test/export-media.css', 'utf8');
		},
		after() {
			if (global.__exportMediaString !== require('fs').readFileSync('test/export-media.css', 'utf8')) {
				throw new Error('The original file did not match the freshly exported copy');
			}
		}
	},
	'basic:export-css-to-type': {
		message: 'supports { exportTo: { to: "test/export-media.css", type: "css" } } usage',
		options: {
			exportTo: { to: 'test/export-media.css', type: 'css' }
		},
		expect: 'basic.expect.css',
		result: 'basic.result.css',
		before() {
			global.__exportMediaString = require('fs').readFileSync('test/export-media.css', 'utf8');
		},
		after() {
			if (global.__exportMediaString !== require('fs').readFileSync('test/export-media.css', 'utf8')) {
				throw new Error('The original file did not match the freshly exported copy');
			}
		}
	}
};
