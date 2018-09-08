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
		}
	}
};
