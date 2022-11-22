import postcssTape from '../../packages/postcss-tape/dist/index.mjs';
import plugin from 'postcss-custom-properties';
import { strict as assert } from 'assert';
import postcssImport from 'postcss-import';
import fs from 'fs';

postcssTape(plugin)({
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
		warnings: 1,
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
		warnings: 1,
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
		warnings: 1,
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
		warnings: 1,
		options: {
			importFrom: 'test/import-properties.json'
		},
		expect: 'basic.import.expect.css',
		result: 'basic.import.result.css'
	},
	'basic:import-cjs': {
		message: 'supports { importFrom: "test/import-properties{-2}?.cjs" } usage',
		warnings: 1,
		options: {
			importFrom: [
				'test/import-properties.cjs',
				'test/import-properties-2.cjs'
			]
		},
		expect: 'basic.import.expect.css',
		result: 'basic.import.result.css'
	},
	'basic:import-mjs': {
		message: 'supports { importFrom: "test/import-properties{-2}?.mjs" } usage',
		warnings: 1,
		options: {
			importFrom: [
				'test/import-properties.mjs',
				'test/import-properties-2.mjs'
			]
		},
		expect: 'basic.import.expect.css',
		result: 'basic.import.result.css'
	},
	'basic:import-css': {
		message: 'supports { importFrom: "test/import-properties{-2}?.css" } usage',
		warnings: 1,
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
		warnings: 1,
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
		warnings: 1,
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
		warnings: 1,
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
		warnings: 1,
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
		warnings: 1,
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
	'basic:import-override:inverse': {
		message: 'importFrom with { preserve: false, overrideImportFromWithRoot: true  } should override importFrom properties',
		warnings: 1,
		options: {
			preserve: false,
			overrideImportFromWithRoot: true,
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
		expect: 'basic.import-override.inverse.expect.css',
		result: 'basic.import-override.inverse.result.css'
	},
	'basic:export': {
		message: 'supports { exportTo: { customProperties: { ... } } } usage',
		warnings: 1,
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
		warnings: 1,
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
		warnings: 1,
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
		warnings: 1,
		options: {
			exportTo: 'test/export-properties.scss'
		},
		expect: 'basic.expect.css',
		result: 'basic.result.css',
		before() {
			try {
				global.__exportPropertiesString = fs.readFileSync('test/export-properties.scss', 'utf8');
				fs.rmSync('test/export-properties.scss');
			} catch (_) {
				// ignore
			}
		},
		after() {
			assert.strictEqual(global.__exportPropertiesString, fs.readFileSync('test/export-properties.scss', 'utf8'));
		}
	},
	'basic:export-json': {
		message: 'supports { exportTo: "test/export-properties.json" } usage',
		warnings: 1,
		options: {
			exportTo: 'test/export-properties.json'
		},
		expect: 'basic.expect.css',
		result: 'basic.result.css',
		before() {
			try {
				global.__exportPropertiesString = fs.readFileSync('test/export-properties.json', 'utf8');
				fs.rmSync('test/export-properties.json');
			} catch (_) {
				// ignore
			}
		},
		after() {
			assert.strictEqual(global.__exportPropertiesString, fs.readFileSync('test/export-properties.json', 'utf8'));
		}
	},
	'basic:export-js': {
		message: 'supports { exportTo: "test/export-properties.js" } usage',
		warnings: 1,
		options: {
			exportTo: 'test/export-properties.js'
		},
		expect: 'basic.expect.css',
		result: 'basic.result.css',
		before() {
			try {
				global.__exportPropertiesString = fs.readFileSync('test/export-properties.js', 'utf8');
				fs.rmSync('test/export-properties.js');
			} catch (_) {
				// ignore
			}
		},
		after() {
			assert.strictEqual(global.__exportPropertiesString, fs.readFileSync('test/export-properties.js', 'utf8'));
		}
	},
	'basic:export-mjs': {
		message: 'supports { exportTo: "test/export-properties.mjs" } usage',
		warnings: 1,
		options: {
			exportTo: 'test/export-properties.mjs'
		},
		expect: 'basic.expect.css',
		result: 'basic.result.css',
		before() {
			try {
				global.__exportPropertiesString = fs.readFileSync('test/export-properties.mjs', 'utf8');
				fs.rmSync('test/export-properties.mjs');
			} catch (_) {
				// ignore
			}
		},
		after() {
			assert.strictEqual(global.__exportPropertiesString, fs.readFileSync('test/export-properties.mjs', 'utf8'));
		}
	},
	'basic:export-css': {
		message: 'supports { exportTo: "test/export-properties.css" } usage',
		warnings: 1,
		options: {
			exportTo: 'test/export-properties.css'
		},
		expect: 'basic.expect.css',
		result: 'basic.result.css',
		before() {
			try {
				global.__exportPropertiesString = fs.readFileSync('test/export-properties.css', 'utf8');
				fs.rmSync('test/export-properties.css');
			} catch (_) {
				// ignore
			}
		},
		after() {
			assert.strictEqual(global.__exportPropertiesString, fs.readFileSync('test/export-properties.css', 'utf8'));
		}
	},
	'basic:export-css-to': {
		message: 'supports { exportTo: { to: "test/export-properties.css" } } usage',
		warnings: 1,
		options: {
			exportTo: { to: 'test/export-properties.css' }
		},
		expect: 'basic.expect.css',
		result: 'basic.result.css',
		before() {
			try {
				global.__exportPropertiesString = fs.readFileSync('test/export-properties.css', 'utf8');
				fs.rmSync('test/export-properties.css');
			} catch (_) {
				// ignore
			}
		},
		after() {
			assert.strictEqual(global.__exportPropertiesString, fs.readFileSync('test/export-properties.css', 'utf8'));
		}
	},
	'basic:export-css-to-type': {
		message: 'supports { exportTo: { to: "test/export-properties.css", type: "css" } } usage',
		warnings: 1,
		options: {
			exportTo: { to: 'test/export-properties.css', type: 'css' }
		},
		expect: 'basic.expect.css',
		result: 'basic.result.css',
		before() {
			try {
				global.__exportPropertiesString = fs.readFileSync('test/export-properties.css', 'utf8');
				fs.rmSync('test/export-properties.css');
			} catch (_) {
				// ignore
			}
		},
		after() {
			assert.strictEqual(global.__exportPropertiesString, fs.readFileSync('test/export-properties.css', 'utf8'));
		}
	},
	'basic:import-is-empty': {
		message: 'supports { importFrom: {} } usage',
		options: {
			importFrom: {},
			disableDeprecationNotice: true
		}
	},
	'import': {
		message: 'supports "postcss-import"',
		plugins: [postcssImport(), plugin()]
	}
});
