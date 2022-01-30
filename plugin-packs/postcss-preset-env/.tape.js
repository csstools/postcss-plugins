const orderDetectionPlugin = (prop, changeWhenMatches) => {
	return {
		postcssPlugin: 'order-detection',
		Declaration(decl) {
			if (changeWhenMatches(decl)) {
				decl.prop = prop;
				decl.value = 'changed-this-declaration';
			}
		},
	}
}

orderDetectionPlugin.postcss = true

module.exports = {
	'basic': {
		message: 'supports basic usage'
	},
	'basic:ff49': {
		message: 'supports { browsers: "ff >= 49" } usage',
		options: {
			browsers: 'ff >= 49'
		}
	},
	'basic:ff66': {
		message: 'supports { browsers: "ff >= 66" } usage',
		options: {
			browsers: 'ff >= 66'
		}
	},
	'basic:ch38': {
		message: 'supports { browsers: "chrome >= 38" } usage',
		options: {
			browsers: 'chrome >= 38'
		}
	},
	'basic:ch88-ff78': {
		message: 'uses :is pseudo for nesting with modern browsers { browsers: "chrome >= 88, firefox >= 78", stage: 0 }',
		options: {
			browsers: 'chrome >= 88, firefox >= 78',
			stage: 0
		}
	},
	'basic:ch88-ff78:no-is-pseudo': {
		message: ':is pseudo for nesting can be disable with modern browsers  { browsers: "chrome >= 88, firefox >= 78", stage: 0, features: { nesting-rules: { noIsPseudoSelector: true } } } usage',
		options: {
			browsers: 'chrome >= 88, firefox >= 78',
			stage: 0,
			features: {
				'nesting-rules': {
					noIsPseudoSelector: true
				}
			}
		}
	},
	'basic:ch88-ff78-saf10': {
		message: 'does not use :is pseudo for nesting with an older browser { browsers: "chrome >= 88, firefox >= 78, safari >= 10", stage: 0 } usage',
		options: {
			browsers: 'chrome >= 88, firefox >= 78, safari >= 10',
			stage: 0
		}
	},
	'basic:stage0': {
		message: 'supports { stage: 0 } usage',
		options: {
			stage: 0
		}
	},
	'basic:stage0-ff49': {
		message: 'supports { browsers: "ff >= 49", stage: 0 } usage',
		options: {
			browsers: 'ff >= 49',
			stage: 0
		}
	},
	'basic:stage0-ff66': {
		message: 'supports { browsers: "ff >= 66", stage: 0 } usage',
		options: {
			browsers: 'ff >= 66',
			stage: 0
		}
	},
	'basic:nesting:true': {
		message: 'supports { stage: false, features: { "nesting-rules": true } } usage',
		options: {
			stage: false,
			features: {
				'nesting-rules': true
			}
		}
	},
	'basic:nesting:false': {
		message: 'supports { stage: 0, features: { "nesting-rules": false } } usage',
		options: {
			stage: 0,
			features: {
				'nesting-rules': false
			}
		}
	},
	'basic:autoprefixer': {
		message: 'supports { autoprefixer: { add: false } } usage',
		options: {
			autoprefixer: {
				add: false
			}
		}
	},
	'basic:autoprefixer:false': {
		message: 'supports { autoprefixer: false } usage',
		options: {
			autoprefixer: false
		}
	},
	'client-side-polyfills:stage-1': {
		message: 'stable client side polyfill behavior',
		options: {
			preserve: false,
			stage: 1,
			enableClientSidePolyfills: true,
		}
	},
	'client-side-polyfills:stage-2': {
		message: 'stable client side polyfill behavior',
		options: {
			preserve: false,
			stage: 2,
			enableClientSidePolyfills: true,
		}
	},
	'client-side-polyfills:stage-3': {
		message: 'stable client side polyfill behavior',
		options: {
			preserve: false,
			stage: 3,
			enableClientSidePolyfills: true,
		}
	},
	'client-side-polyfills:stage-4': {
		message: 'stable client side polyfill behavior',
		options: {
			preserve: false,
			stage: 4,
			enableClientSidePolyfills: true,
		}
	},
	'custom-properties': {
		message: 'supports { browsers: "ie >= 10" } usage',
		options: {
			browsers: 'ie >= 10'
		}
	},
	'custom-properties:disabled': {
		message: 'supports { browsers: "ie >= 10", features: { "custom-properties": false } } usage',
		options: {
			browsers: 'ie >= 10',
			features: {
				'custom-properties': false
			}
		}
	},
	'custom-properties:enabled': {
		message: 'supports { browsers: "chrome >= 60", features: { "custom-properties": true } } usage',
		options: {
			browsers: 'chrome >= 60',
			features: {
				'custom-properties': true
			}
		}
	},
	'insert:baseline': {
		message: 'supports { insertBefore/insertAfter } usage baseline',
		options: {
			stage: 0,
			features: {
				'lab-function': true
			}
		}
	},
	'insert:before:match-source': {
		message: 'supports { insertBefore } usage when looking for source',
		options: {
			stage: 0,
			features: {
				'lab-function': true
			},
			insertBefore: {
				'lab-function': [
					orderDetectionPlugin('before', (decl) => {
						return decl.prop === 'color' && decl.value.indexOf('lab(') === 0;
					})
				]
			}
		}
	},
	'insert:before:match-result': {
		message: 'supports { insertBefore } usage when looking for a result',
		options: {
			stage: 0,
			features: {
				'lab-function': true
			},
			insertBefore: {
				'lab-function': [
					orderDetectionPlugin('before', (decl) => {
						return decl.prop === 'color' && decl.value.indexOf('rgba(') === 0;
					})
				]
			}
		}
	},
	'insert:after:match-result:feature-is-run': {
		message: 'supports { insertBefore } usage when looking for a result and the attached feature is skipped',
		options: {
			stage: 0,
			browsers: [
				'safari >= 15',
			],
			insertAfter: {
				'lab-function': [
					orderDetectionPlugin('after', (decl) => {
						return decl.prop === 'color' && decl.value !== 'changed-this-declaration';
					})
				]
			}
		}
	},
	'insert:after:match-result:feature-is-skipped': {
		message: 'supports { insertBefore } usage when looking for a result and the attached feature is skipped',
		options: {
			stage: 0,
			browsers: [
				'safari >= 15',
			],
			insertAfter: {
				'lab-function': [
					orderDetectionPlugin('after', (decl) => {
						return decl.prop === 'color' && decl.value !== 'changed-this-declaration';
					})
				]
			}
		}
	},
	'insert:after:match-source': {
		message: 'supports { insertAfter } usage when looking for source',
		options: {
			stage: 0,
			features: {
				'lab-function': true
			},
			insertAfter: {
				'lab-function': [
					orderDetectionPlugin('after', (decl) => {
						return decl.prop === 'color' && decl.value.indexOf('lab(') === 0;
					})
				]
			}
		}
	},
	'insert:after:match-result': {
		message: 'supports { insertAfter } usage when looking for a result',
		options: {
			stage: 0,
			features: {
				'lab-function': true
			},
			insertAfter: {
				'lab-function': [
					orderDetectionPlugin('after', (decl) => {
						return decl.prop === 'color' && decl.value.indexOf('rgba(') === 0;
					})
				]
			}
		}
	},
	'insert:after:match-result:exec': {
		message: 'supports { insertAfter with a single plugin, not an array } usage when looking for a result',
		options: {
			stage: 0,
			features: {
				'lab-function': true
			},
			insertAfter: {
				'lab-function': orderDetectionPlugin('after', (decl) => {
					return decl.prop === 'color' && decl.value.indexOf('rgba(') === 0;
				})
			}
		},
		expect: 'insert.after.match-result.expect.css'
	},
	'import': {
		message: 'supports { importFrom: { customMedia, customProperties, customSelectors, environmentVariables } } usage',
		options: {
			importFrom: {
				customMedia: {
					'--narrow-window': '(max-width: env(--sm))'
				},
				customProperties: {
					'--order': '1'
				},
				customSelectors: {
					':--heading': 'h1, h2, h3, h4, h5, h6'
				},
				environmentVariables: {
					'--sm': '40rem'
				}
			},
			stage: 0
		}
	},
	'import:ch87': {
		message: 'supports { browsers: "chrome >= 87", importFrom: { customMedia, customProperties, customSelectors, environmentVariables } } usage',
		options: {
			browsers: 'chrome >= 87',
			importFrom: {
				customMedia: {
					'--narrow-window': '(max-width: env(--sm))'
				},
				customProperties: {
					'--order': '1'
				},
				customSelectors: {
					':--heading': 'h1, h2, h3, h4, h5, h6'
				},
				environmentVariables: {
					'--sm': '40rem'
				}
			},
			stage: 0
		}
	},
	'import:ch87:array': {
		message: 'supports { browsers: "chrome >= 87", importFrom: [{ customMedia, customProperties, customSelectors, environmentVariables }] } usage',
		options: {
			browsers: 'chrome >= 87',
			importFrom: [{
				customMedia: {
					'--narrow-window': '(max-width: env(--sm))'
				},
				customProperties: {
					'--order': '1'
				},
				customSelectors: {
					':--heading': 'h1, h2, h3, h4, h5, h6'
				},
				environmentVariables: {
					'--sm': '40rem'
				}
			}],
			stage: 0
		}
	},
	'import:ch87:incorrect-options': {
		message: 'supports { browsers: "chrome >= 87", importFrom: false } usage',
		options: {
			browsers: 'chrome >= 87',
			importFrom: false,
			stage: 0
		}
	},
	'basic:export': {
		message: 'supports { stage: 0 } usage',
		options: {
			stage: 0,
			exportTo: [
				'test/generated-custom-exports.css',
				'test/generated-custom-exports.js',
				'test/generated-custom-exports.json',
				'test/generated-custom-exports.mjs'
			]
		},
		expect: 'basic.stage0.expect.css',
		result: 'basic.stage0.result.css',
		before() {
			try {
				global.__exportTo = {
					css: require('fs').readFileSync('test/generated-custom-exports.css', 'utf8'),
					js: require('fs').readFileSync('test/generated-custom-exports.js', 'utf8'),
					json: require('fs').readFileSync('test/generated-custom-exports.json', 'utf8'),
					mjs: require('fs').readFileSync('test/generated-custom-exports.mjs', 'utf8')
				};

				require('fs').rmSync('test/generated-custom-exports.css');
				require('fs').rmSync('test/generated-custom-exports.js');
				require('fs').rmSync('test/generated-custom-exports.json');
				require('fs').rmSync('test/generated-custom-exports.mjs');
			} catch (_) {
				// ignore errors here.
				// If the files are removed manually test run will regenerate these.
				// The after step will still fail.
				// The real test is in the after step.
			}
		},
		after() {
			global.__exportAs = {
				css: require('fs').readFileSync('test/generated-custom-exports.css', 'utf8'),
				js: require('fs').readFileSync('test/generated-custom-exports.js', 'utf8'),
				json: require('fs').readFileSync('test/generated-custom-exports.json', 'utf8'),
				mjs: require('fs').readFileSync('test/generated-custom-exports.mjs', 'utf8')
			};

			Object.keys(global.__exportTo).forEach(key => {
				if (global.__exportTo[key] !== global.__exportAs[key]) {
					throw new Error(`The original ${key} file did not match the freshly exported copy`);
				}
			});
		}
	},
	"unknown-feature": {
		message: 'warns on unknown features',
		warnings: 3,
		options: {
			features: {
				"custom-media": true,
				"postcss-logical": true,
				"postcss-logica": true,
			}
		},
	}
};
