const postcssTape = require('../../packages/postcss-tape/dist/index.cjs');
const plugin = require('@csstools/postcss-custom-selectors-import-export');

postcssTape(plugin)({
	'basic': {
		message: 'does nothing when no options are set',
	},
	'basic-import': {
		message: 'supports { importFrom: { customSelectors: { ... } } } usage',
		options: {
			importFrom: {
				customSelectors: {
					':--heading': 'h1, h2, h3',
					':--text': ':--heading, p',
				}
			}
		}
	},
	'basic-import:override-import-from-with-root:true': {
		message: 'supports { overrideImportFromWithRoot: true, importFrom: { customSelectors: { ... } } } usage',
		options: {
			overrideImportFromWithRoot: true,
			importFrom: {
				customSelectors: {
					':--heading': 'h1, h2, h3',
					':--text': ':--heading, p',
				}
			},
			exportTo(customProperties) {
				if (customProperties[':--text'] !== 'p, b, strong, i, em, quote, cite') {
					throw new Error('Incorrect value in exportTo ' + customProperties[':--text']);
				}
			}
		}
	},
	'basic-import:override-import-from-with-root:false': {
		message: 'supports { overrideImportFromWithRoot: true, importFrom: { customSelectors: { ... } } } usage',
		options: {
			overrideImportFromWithRoot: false,
			importFrom: {
				customSelectors: {
					':--heading': 'h1, h2, h3',
					':--text': ':--heading, p',
				}
			},
			exportTo(customProperties) {
				if (customProperties[':--text'] !== ':--heading, p') {
					throw new Error('Incorrect value in exportTo ' + customProperties[':--text']);
				}
			}
		}
	},
	'basic-import:fn': {
		message: 'supports { importFrom() } usage',
		options: {
			importFrom() {
				return {
					customSelectors: {
						':--heading': 'h1, h2, h3',
						':--text': ':--heading, p',
					}
				};
			}
		},
	},
	'basic-import:fn-promise': {
		message: 'supports { async importFrom() } usage',
		options: {
			importFrom() {
				return new Promise(resolve => {
					resolve({
						customSelectors: {
							':--heading': 'h1, h2, h3',
							':--text': ':--heading, p',
						}
					})
				});
			}
		},
	},
	'basic-import:json': {
		message: 'supports { importFrom: "test/import-selectors.json" } usage',
		options: {
			importFrom: 'test/import-selectors.json'
		},
	},
	'basic-import:js': {
		message: 'supports { importFrom: "test/import-selectors.js" } usage',
		options: {
			importFrom: 'test/import-selectors.js'
		},
	},
	'basic-import:css': {
		message: 'supports { importFrom: "test/import-selectors.css" } usage',
		options: {
			importFrom: 'test/import-selectors.css'
		},
	},
	'basic-import:css-from': {
		message: 'supports { importFrom: { from: "test/import-selectors.css" } } usage',
		options: {
			importFrom: { from: 'test/import-selectors.css' }
		},
	},
	'basic-import:css-from-multiple-files': {
		message: 'supports { importFrom: ["test/empty.css", "test/import-selectors.css"] } usage',
		options: {
			importFrom: ["test/empty.css", "test/import-selectors.css"]
		},
	},
	'basic-import:css-from-type': {
		message: 'supports { importFrom: [ { from: "test/import-selectors.css", type: "css" } ] } usage',
		options: {
			importFrom: [{ from: 'test/import-selectors.css', type: 'css' }]
		},
	},
	'basic-import:empty': {
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
	},
	'basic:export-json': {
		message: 'supports { exportTo: "test/export-selectors.json" } usage',
		options: {
			exportTo: 'test/export-selectors.json'
		},
		before() {
			global.__exportSelectorsString = require('fs').readFileSync('test/export-selectors.json', 'utf8');
		},
		after() {
			if (global.__exportSelectorsString !== require('fs').readFileSync('test/export-selectors.json', 'utf8')) {
				throw new Error('The original file did not match the freshly exported copy');
			}
		},
	},
	'basic:export-js': {
		message: 'supports { exportTo: "test/export-selectors.js" } usage',
		options: {
			exportTo: 'test/export-selectors.js'
		},
		before() {
			global.__exportSelectorsString = require('fs').readFileSync('test/export-selectors.js', 'utf8');
		},
		after() {
			if (global.__exportSelectorsString !== require('fs').readFileSync('test/export-selectors.js', 'utf8')) {
				throw new Error('The original file did not match the freshly exported copy');
			}
		},
	},
	'basic:export-mjs': {
		message: 'supports { exportTo: "test/export-selectors.mjs" } usage',
		options: {
			exportTo: 'test/export-selectors.mjs'
		},
		before() {
			global.__exportSelectorsString = require('fs').readFileSync('test/export-selectors.mjs', 'utf8');
		},
		after() {
			if (global.__exportSelectorsString !== require('fs').readFileSync('test/export-selectors.mjs', 'utf8')) {
				throw new Error('The original file did not match the freshly exported copy');
			}
		},
	},
	'basic:export-css': {
		message: 'supports { exportTo: "test/export-selectors.css" } usage',
		options: {
			exportTo: 'test/export-selectors.css'
		},
		before() {
			global.__exportSelectorsString = require('fs').readFileSync('test/export-selectors.css', 'utf8');
		},
		after() {
			if (global.__exportSelectorsString !== require('fs').readFileSync('test/export-selectors.css', 'utf8')) {
				throw new Error('The original file did not match the freshly exported copy');
			}
		},
	},
	'basic:export-css-to': {
		message: 'supports { exportTo: { to: "test/export-selectors.css" } } usage',
		options: {
			exportTo: { to: 'test/export-selectors.css' }
		},
		before() {
			global.__exportSelectorsString = require('fs').readFileSync('test/export-selectors.css', 'utf8');
		},
		after() {
			if (global.__exportSelectorsString !== require('fs').readFileSync('test/export-selectors.css', 'utf8')) {
				throw new Error('The original file did not match the freshly exported copy');
			}
		},
	},
	'basic:export-css-to-type': {
		message: 'supports { exportTo: { to: "test/export-selectors.css", type: "css" } } usage',
		options: {
			exportTo: { to: 'test/export-selectors.css', type: 'css' }
		},
		before() {
			global.__exportSelectorsString = require('fs').readFileSync('test/export-selectors.css', 'utf8');
		},
		after() {
			if (global.__exportSelectorsString !== require('fs').readFileSync('test/export-selectors.css', 'utf8')) {
				throw new Error('The original file did not match the freshly exported copy');
			}
		},
	}
});
