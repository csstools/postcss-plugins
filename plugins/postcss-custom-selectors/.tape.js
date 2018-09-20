module.exports = {
	'postcss-custom-selectors': {
		'basic': {
			message: 'supports basic usage'
		},
		'basic:preserve': {
			message: 'supports { preserve: true } usage',
			options: {
				preserve: true
			}
		},
		'safety': {
			message: 'supports safe tag ordering (.foo:--h1 becomes h1.foo instead of .fooh1)'
		},
		'basic:import': {
			message: 'supports { importFrom: { customSelectors: { ... } } } usage',
			options: {
				importFrom: {
					customSelectors: {
						':--heading': 'h1, h2, h3'
					}
				}
			}
		},
		'basic:import-fn': {
			message: 'supports { importFrom() } usage',
			options: {
				importFrom() {
					return {
						customSelectors: {
							':--heading': 'h1, h2, h3'
						}
					};
				}
			},
			expect: 'basic.import.expect.css',
			result: 'basic.import.result.css'
		},
		'basic:import-fn-promise': {
			message: 'supports { async importFrom() } usage',
			options: {
				importFrom() {
					return new Promise(resolve => {
						resolve({
							customSelectors: {
								':--heading': 'h1, h2, h3'
							}
						})
					});
				}
			},
			expect: 'basic.import.expect.css',
			result: 'basic.import.result.css'
		},
		'basic:import-json': {
			message: 'supports { importFrom: "test/import-selectors.json" } usage',
			options: {
				importFrom: 'test/import-selectors.json'
			},
			expect: 'basic.import.expect.css',
			result: 'basic.import.result.css'
		},
		'basic:import-js': {
			message: 'supports { importFrom: "test/import-selectors.js" } usage',
			options: {
				importFrom: 'test/import-selectors.js'
			},
			expect: 'basic.import.expect.css',
			result: 'basic.import.result.css'
		},
		'basic:import-css': {
			message: 'supports { importFrom: "test/import-selectors.css" } usage',
			options: {
				importFrom: 'test/import-selectors.css'
			},
			expect: 'basic.import.expect.css',
			result: 'basic.import.result.css'
		},
		'basic:import-css-from': {
			message: 'supports { importFrom: { from: "test/import-selectors.css" } } usage',
			options: {
				importFrom: { from: 'test/import-selectors.css' }
			},
			expect: 'basic.import.expect.css',
			result: 'basic.import.result.css'
		},
		'basic:import-css-from-type': {
			message: 'supports { importFrom: [ { from: "test/import-selectors.css", type: "css" } ] } usage',
			options: {
				importFrom: [ { from: 'test/import-selectors.css', type: 'css' } ]
			},
			expect: 'basic.import.expect.css',
			result: 'basic.import.result.css'
		},
		'basic:import-empty': {
			message: 'supports { importFrom: {} } usage',
			options: {
				importFrom: {}
			}
		},
		'basic:export': {
			message: 'supports { exportTo: { customSelectors: { ... } } } usage',
			options: {
				exportTo: (global.__exportSelectorObject = global.__exportSelectorObject || {
					customSelectors: null
				})
			},
			expect: 'basic.expect.css',
			result: 'basic.result.css',
			after() {
				if (__exportSelectorObject.customSelectors[':--foo'] !== '.foo') {
					throw new Error('The exportTo function failed');
				}
			}
		},
		'basic:export-fn': {
			message: 'supports { exportTo() } usage',
			options: {
				exportTo(customProperties) {
					if (customProperties[':--foo'] !== '.foo') {
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
				exportTo(customProperties) {
					return new Promise((resolve, reject) => {
						if (customProperties[':--foo'] !== '.foo') {
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
			message: 'supports { exportTo: "test/export-selectors.json" } usage',
			options: {
				exportTo: 'test/export-selectors.json'
			},
			expect: 'basic.expect.css',
			result: 'basic.result.css',
			before() {
				global.__exportSelectorsString = require('fs').readFileSync('test/export-selectors.json', 'utf8');
			},
			after() {
				if (global.__exportSelectorsString !== require('fs').readFileSync('test/export-selectors.json', 'utf8')) {
					throw new Error('The original file did not match the freshly exported copy');
				}
			}
		},
		'basic:export-js': {
			message: 'supports { exportTo: "test/export-selectors.js" } usage',
			options: {
				exportTo: 'test/export-selectors.js'
			},
			expect: 'basic.expect.css',
			result: 'basic.result.css',
			before() {
				global.__exportSelectorsString = require('fs').readFileSync('test/export-selectors.js', 'utf8');
			},
			after() {
				if (global.__exportSelectorsString !== require('fs').readFileSync('test/export-selectors.js', 'utf8')) {
					throw new Error('The original file did not match the freshly exported copy');
				}
			}
		},
		'basic:export-mjs': {
			message: 'supports { exportTo: "test/export-selectors.mjs" } usage',
			options: {
				exportTo: 'test/export-selectors.mjs'
			},
			expect: 'basic.expect.css',
			result: 'basic.result.css',
			before() {
				global.__exportSelectorsString = require('fs').readFileSync('test/export-selectors.mjs', 'utf8');
			},
			after() {
				if (global.__exportSelectorsString !== require('fs').readFileSync('test/export-selectors.mjs', 'utf8')) {
					throw new Error('The original file did not match the freshly exported copy');
				}
			}
		},
		'basic:export-css': {
			message: 'supports { exportTo: "test/export-selectors.css" } usage',
			options: {
				exportTo: 'test/export-selectors.css'
			},
			expect: 'basic.expect.css',
			result: 'basic.result.css',
			before() {
				global.__exportSelectorsString = require('fs').readFileSync('test/export-selectors.css', 'utf8');
			},
			after() {
				if (global.__exportSelectorsString !== require('fs').readFileSync('test/export-selectors.css', 'utf8')) {
					throw new Error('The original file did not match the freshly exported copy');
				}
			}
		},
		'basic:export-css-to': {
			message: 'supports { exportTo: { to: "test/export-selectors.css" } } usage',
			options: {
				exportTo: { to: 'test/export-selectors.css' }
			},
			expect: 'basic.expect.css',
			result: 'basic.result.css',
			before() {
				global.__exportSelectorsString = require('fs').readFileSync('test/export-selectors.css', 'utf8');
			},
			after() {
				if (global.__exportSelectorsString !== require('fs').readFileSync('test/export-selectors.css', 'utf8')) {
					throw new Error('The original file did not match the freshly exported copy');
				}
			}
		},
		'basic:export-css-to-type': {
			message: 'supports { exportTo: { to: "test/export-selectors.css", type: "css" } } usage',
			options: {
				exportTo: { to: 'test/export-selectors.css', type: 'css' }
			},
			expect: 'basic.expect.css',
			result: 'basic.result.css',
			before() {
				global.__exportSelectorsString = require('fs').readFileSync('test/export-selectors.css', 'utf8');
			},
			after() {
				if (global.__exportSelectorsString !== require('fs').readFileSync('test/export-selectors.css', 'utf8')) {
					throw new Error('The original file did not match the freshly exported copy');
				}
			}
		}
	}
};
