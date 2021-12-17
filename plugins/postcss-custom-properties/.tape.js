module.exports = {
	'basic': {
		message: 'supports basic usage'
	},
	'basic:preserve': {
		message: 'supports { preserve: false } usage',
		options: {
			preserve: false
		}
	},
	'basic:import': {
		message: 'supports { importFrom: { customProperties: { ... } } } usage',
		options: {
			importFrom: {
				customProperties: {
					'--color': 'rgb(255, 0, 0)',
					'--color-2': 'yellow',
					'--ref-color': 'var(--color)',
					'--margin': '0 10px 20px 30px',
					'--z-index': 10
				}
			}
		}
	},
	'basic:import-fn': {
		message: 'supports { importFrom() } usage',
		options: {
			importFrom() {
				return {
					customProperties: {
						'--color': 'rgb(255, 0, 0)',
						'--color-2': 'yellow',
						'--ref-color': 'var(--color)',
						'--margin': '0 10px 20px 30px',
						'--z-index': 10
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
						customProperties: {
							'--color': 'rgb(255, 0, 0)',
							'--color-2': 'yellow',
							'--ref-color': 'var(--color)',
							'--z-index': 10
						}
					})
				});
			}
		},
		expect: 'basic.import.expect.css',
		result: 'basic.import.result.css'
	},
	'basic:import-json': {
		message: 'supports { importFrom: "test/import-properties.json" } usage',
		options: {
			importFrom: 'test/import-properties.json'
		},
		expect: 'basic.import.expect.css',
		result: 'basic.import.result.css'
	},
	'basic:import-js': {
		message: 'supports { importFrom: "test/import-properties{-2}?.js" } usage',
		options: {
			importFrom: [
				'test/import-properties.js',
				'test/import-properties-2.js'
			]
		},
		expect: 'basic.import.expect.css',
		result: 'basic.import.result.css'
	},
	'basic:import-css': {
		message: 'supports { importFrom: "test/import-properties{-2}?.css" } usage',
		options: {
			importFrom: [
				'test/import-properties.css',
				'test/import-properties-2.css'
			]
		},
		expect: 'basic.import.expect.css',
		result: 'basic.import.result.css'
	},
	'basic:import-css-js': {
		message: 'supports { importFrom: "test/import-properties{-2}?.{css|js}" } usage',
		options: {
			importFrom: [
				'test/import-properties.js',
				'test/import-properties-2.css'
			]
		},
		expect: 'basic.import.expect.css',
		result: 'basic.import.result.css'
	},
	'basic:import-css-pcss': {
		message: 'supports { importFrom: "test/import-properties.{p}?css" } usage',
		options: {
			importFrom: [
				'test/import-properties.pcss',
				'test/import-properties-2.css'
			]
		},
		expect: 'basic.import.expect.css',
		result: 'basic.import.result.css'
	},
	'basic:import-css-from': {
		message: 'supports { importFrom: { from: "test/import-properties.css" } } usage',
		options: {
			importFrom: [
				{ from: 'test/import-properties.css' },
				{ from: 'test/import-properties-2.css' }
			]
		},
		expect: 'basic.import.expect.css',
		result: 'basic.import.result.css'
	},
	'basic:import-css-from-type': {
		message: 'supports { importFrom: [ { from: "test/import-properties.css", type: "css" } ] } usage',
		options: {
			importFrom: [
				{ from: 'test/import-properties.css', type: 'css' },
				{ from: 'test/import-properties-2.css', type: 'css' }
			]
		},
		expect: 'basic.import.expect.css',
		result: 'basic.import.result.css'
	},
	'basic:import-override': {
		message: 'importFrom with { preserve: false } should override root properties',
		options: {
			preserve: false,
			importFrom: {
				customProperties: {
					'--color': 'rgb(0, 0, 0)',
					'--color-2': 'yellow',
					'--ref-color': 'var(--color)',
					'--margin': '0 10px 20px 30px',
					'--shadow-color': 'rgb(0,0,0)',
					'--z-index': 10
				}
			}
		},
		expect: 'basic.import-override.expect.css',
		result: 'basic.import-override.result.css'
	},
	'basic:export': {
		message: 'supports { exportTo: { customProperties: { ... } } } usage',
		options: {
			exportTo: (global.__exportPropertiesObject = global.__exportPropertiesObject || {
				customProperties: null
			})
		},
		expect: 'basic.expect.css',
		result: 'basic.result.css',
		after() {
			if (__exportPropertiesObject.customProperties['--color'] !== 'rgb(255, 0, 0)') {
				throw new Error('The exportTo function failed');
			}
		}
	},
	'basic:export-fn': {
		message: 'supports { exportTo() } usage',
		options: {
			exportTo(customProperties) {
				if (customProperties['--color'] !== 'rgb(255, 0, 0)') {
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
					if (customProperties['--color'] !== 'rgb(255, 0, 0)') {
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
	'basic:export-scss': {
		message: 'supports { exportTo: "test/export-properties.scss" } usage',
		options: {
			exportTo: 'test/export-properties.scss'
		},
		expect: 'basic.expect.css',
		result: 'basic.result.css',
		before() {
			global.__exportPropertiesString = require('fs').readFileSync('test/export-properties.scss', 'utf8');
		},
		after() {
			if (global.__exportPropertiesString !== require('fs').readFileSync('test/export-properties.scss', 'utf8')) {
				throw new Error('The original file did not match the freshly exported copy');
			}
		}
	},
	'basic:export-json': {
		message: 'supports { exportTo: "test/export-properties.json" } usage',
		options: {
			exportTo: 'test/export-properties.json'
		},
		expect: 'basic.expect.css',
		result: 'basic.result.css',
		before() {
			global.__exportPropertiesString = require('fs').readFileSync('test/export-properties.json', 'utf8');
		},
		after() {
			if (global.__exportPropertiesString !== require('fs').readFileSync('test/export-properties.json', 'utf8')) {
				throw new Error('The original file did not match the freshly exported copy');
			}
		}
	},
	'basic:export-js': {
		message: 'supports { exportTo: "test/export-properties.js" } usage',
		options: {
			exportTo: 'test/export-properties.js'
		},
		expect: 'basic.expect.css',
		result: 'basic.result.css',
		before() {
			global.__exportPropertiesString = require('fs').readFileSync('test/export-properties.js', 'utf8');
		},
		after() {
			if (global.__exportPropertiesString !== require('fs').readFileSync('test/export-properties.js', 'utf8')) {
				throw new Error('The original file did not match the freshly exported copy');
			}
		}
	},
	'basic:export-mjs': {
		message: 'supports { exportTo: "test/export-properties.mjs" } usage',
		options: {
			exportTo: 'test/export-properties.mjs'
		},
		expect: 'basic.expect.css',
		result: 'basic.result.css',
		before() {
			global.__exportPropertiesString = require('fs').readFileSync('test/export-properties.mjs', 'utf8');
		},
		after() {
			if (global.__exportPropertiesString !== require('fs').readFileSync('test/export-properties.mjs', 'utf8')) {
				throw new Error('The original file did not match the freshly exported copy');
			}
		}
	},
	'basic:export-css': {
		message: 'supports { exportTo: "test/export-properties.css" } usage',
		options: {
			exportTo: 'test/export-properties.css'
		},
		expect: 'basic.expect.css',
		result: 'basic.result.css',
		before() {
			global.__exportPropertiesString = require('fs').readFileSync('test/export-properties.css', 'utf8');
		},
		after() {
			if (global.__exportPropertiesString !== require('fs').readFileSync('test/export-properties.css', 'utf8')) {
				throw new Error('The original file did not match the freshly exported copy');
			}
		}
	},
	'basic:export-css-to': {
		message: 'supports { exportTo: { to: "test/export-properties.css" } } usage',
		options: {
			exportTo: { to: 'test/export-properties.css' }
		},
		expect: 'basic.expect.css',
		result: 'basic.result.css',
		before() {
			global.__exportPropertiesString = require('fs').readFileSync('test/export-properties.css', 'utf8');
		},
		after() {
			if (global.__exportPropertiesString !== require('fs').readFileSync('test/export-properties.css', 'utf8')) {
				throw new Error('The original file did not match the freshly exported copy');
			}
		}
	},
	'basic:export-css-to-type': {
		message: 'supports { exportTo: { to: "test/export-properties.css", type: "css" } } usage',
		options: {
			exportTo: { to: 'test/export-properties.css', type: 'css' }
		},
		expect: 'basic.expect.css',
		result: 'basic.result.css',
		before() {
			global.__exportPropertiesString = require('fs').readFileSync('test/export-properties.css', 'utf8');
		},
		after() {
			if (global.__exportPropertiesString !== require('fs').readFileSync('test/export-properties.css', 'utf8')) {
				throw new Error('The original file did not match the freshly exported copy');
			}
		}
	},
	'basic:import-is-empty': {
		message: 'supports { importFrom: {} } usage',
		options: {
			importFrom: {}
		}
	}
};
