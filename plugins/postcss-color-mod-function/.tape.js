module.exports = {
	'postcss-color-mod-function': {
		'basic': {
			message: 'supports basic usage'
		},
		'basic:colors': {
			message: 'supports { stringifier } usage',
			options: {
				stringifier: color => color.toString()
			}
		},
		'basic:transformvars': {
			message: 'supports { transformVars: false } usage',
			options: {
				transformVars: false
			},
			error: {
				reason: 'Expected a color'
			}
		},
		'warn': {
			message: 'supports { unresolved } usage',
			options: {
				unresolved: 'warn'
			},
			warning: 43,
			expect: 'warn.css'
		},
		'hex': {
			message: 'supports hex usage'
		},
		'import': {
			message: 'supports { importFrom: "test/import-root.css" } usage',
			options: {
				importFrom: 'test/import-root.css'
			}
		},
		'import:array': {
			message: 'supports { importFrom: ["test/import-root.css"] } usage',
			options: {
				importFrom: ['test/import-root.css']
			},
			expect: 'import.expect.css',
			result: 'import.result.css'
		},
		'import:array-array': {
			message: 'supports { importFrom: [["css", "test/import-root.css" ]] } usage',
			options: {
				importFrom: { from: 'test/import-root.css', type: 'css' }
			},
			expect: 'import.expect.css',
			result: 'import.result.css'
		},
		'import:js': {
			message: 'supports { importFrom: "test/import-root.js" } usage',
			options: {
				importFrom: 'test/import-root.js'
			},
			expect: 'import.expect.css',
			result: 'import.result.css'
		},
		'import:json': {
			message: 'supports { importFrom: "test/import-root.json" } usage',
			options: {
				importFrom: 'test/import-root.json'
			},
			expect: 'import.expect.css',
			result: 'import.result.css'
		},
		'import:object': {
			message: 'supports { importFrom: { customProperties: {} } } usage',
			options: {
				importFrom: [
					{
						customProperties: {
							'--color': 'var(--color-blue)'
						}
					},
					{
						customProperties: {
							'--color-blue': 'blue',
							'--color-red': 'red'
						}
					}
				]
			},
			expect: 'import.expect.css',
			result: 'import.result.css'
		}
	}
};
