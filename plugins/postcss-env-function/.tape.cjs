const postcssTape = require('../../packages/postcss-tape/dist/index.cjs');
const plugin = require('postcss-env-function');

postcssTape(plugin)({
	'basic': {
		message: 'supports basic usage',
	},
	'basic:import': {
		message: 'supports { importFrom: { environmentVariables: { ... } } } usage',
		options: {
			disableDeprecationNotice: true,
			importFrom: {
				environmentVariables: {
					'--some-custom-padding': '20px',
					'--another-custom-width': '600px'
				}
			}
		}
	},
	'basic:import-fn': {
		message: 'supports { importFrom() } usage',
		warnings: 1,
		options: {
			importFrom() {
				return {
					environmentVariables: {
						'--some-custom-padding': '20px',
						'--another-custom-width': '600px'
					}
				};
			}
		},
		expect: 'basic.import.expect.css',
		result: 'basic.import.result.css'
	},
	'basic:import-fn-promise': {
		message: 'supports { async importFrom() } usage',
		warnings: 1,
		options: {
			importFrom() {
				return new Promise(resolve => {
					resolve({
						environmentVariables: {
							'--some-custom-padding': '20px',
							'--another-custom-width': '600px'
						}
					})
				});
			}
		},
		expect: 'basic.import.expect.css',
		result: 'basic.import.result.css'
	},
	'basic:import-json': {
		message: 'supports { importFrom: "test/import-variables.json" } usage',
		warnings: 1,
		options: {
			importFrom: 'test/import-variables.json'
		},
		expect: 'basic.import.expect.css',
		result: 'basic.import.result.css'
	},
	'basic:import-js': {
		message: 'supports { importFrom: "test/import-variables.js" } usage',
		warnings: 1,
		options: {
			importFrom: 'test/import-variables.js'
		},
		expect: 'basic.import.expect.css',
		result: 'basic.import.result.css'
	},
	'basic:import-cjs': {
		message: 'supports { importFrom: "test/import-variables.cjs" } usage',
		warnings: 1,
		options: {
			importFrom: 'test/import-variables.cjs'
		},
		expect: 'basic.import.expect.css',
		result: 'basic.import.result.css'
	},
	'basic:import-js-from': {
		message: 'supports { importFrom: { from: "test/import-variables.js" } } usage',
		warnings: 1,
		options: {
			importFrom: { from: 'test/import-variables.js' }
		},
		expect: 'basic.import.expect.css',
		result: 'basic.import.result.css'
	},
	'basic:import-js-from-type': {
		message: 'supports { importFrom: [ { from: "test/import-variables.js", type: "js" } ] } usage',
		warnings: 1,
		options: {
			importFrom: [ { from: 'test/import-variables.js', type: 'js' } ]
		},
		expect: 'basic.import.expect.css',
		result: 'basic.import.result.css'
	},
	'basic:import-is-empty': {
		message: 'supports { importFrom: {} } usage',
		options: {
			importFrom: {}
		}
	}
});
