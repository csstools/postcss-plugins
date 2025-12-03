import { postcssTape } from '@csstools/postcss-tape';
import plugin from 'postcss-preset-env';
import postcssBundler from '@csstools/postcss-bundler';

const orderDetectionPlugin = (prop, changeWhenMatches) => {
	return {
		postcssPlugin: 'order-detection',
		Declaration(decl) {
			if (changeWhenMatches(decl)) {
				decl.prop = prop;
				decl.value = 'changed-this-declaration';
			}
		},
	};
};

orderDetectionPlugin.postcss = true;

postcssTape(plugin)({
	'basic': {
		message: 'supports basic usage',
	},
	'basic:edge16': {
		message: 'supports { browsers: "edge >= 16" } usage',
		options: {
			browsers: 'edge >= 16',
		},
	},
	'basic:ff49': {
		message: 'supports { browsers: "ff >= 49" } usage',
		options: {
			browsers: 'ff >= 49',
		},
	},
	'basic:ff66': {
		message: 'supports { browsers: "ff >= 66" } usage',
		options: {
			browsers: 'ff >= 66',
		},
	},
	'basic:ch38': {
		message: 'supports { browsers: "chrome >= 38" } usage',
		options: {
			browsers: 'chrome >= 38',
		},
	},
	'basic:ch126': {
		message: 'supports { browsers: "chrome >= 126" } usage',
		options: {
			browsers: 'chrome >= 126',
		},
	},
	'basic:ch130': {
		message: 'supports { browsers: "chrome >= 130" } usage',
		options: {
			browsers: 'chrome >= 130',
		},
	},
	'basic:ie10': {
		message: 'supports { browsers: "ie >= 10" } usage',
		options: {
			browsers: 'ie >= 10',
		},
	},
	'basic:safari15': {
		message: 'supports { browsers: "safari >= 15" } usage',
		options: {
			browsers: 'safari >= 15',
		},
	},
	'basic:op_mini': {
		message: 'supports { browsers: "op_mini all" } usage',
		options: {
			stage: 0,
			browsers: 'op_mini all',
		},
	},
	'basic:supports-query': {
		message: 'supports { browsers: "defaults and supports css-variables" } usage',
		options: {
			browsers: 'defaults and supports css-variables',
		},
	},
	'basic:stage0': {
		message: 'supports { stage: 0 } usage',
		options: {
			stage: 0,
		},
	},
	'basic:stage0-ff49': {
		message: 'supports { browsers: "ff >= 49", stage: 0 } usage',
		options: {
			browsers: 'ff >= 49',
			stage: 0,
		},
	},
	'basic:stage0-ff66': {
		message: 'supports { browsers: "ff >= 66", stage: 0 } usage',
		options: {
			browsers: 'ff >= 66',
			stage: 0,
		},
	},
	'basic:vendors-1': {
		message: 'supports { minimumVendorImplementations: 1, enableClientSidePolyfills: false } usage',
		options: {
			stage: 1,
			minimumVendorImplementations: 1,
			enableClientSidePolyfills: false,
		},
	},
	'basic:vendors-2': {
		message: 'supports { minimumVendorImplementations: 2, enableClientSidePolyfills: false } usage',
		options: {
			stage: 1,
			minimumVendorImplementations: 2,
			enableClientSidePolyfills: false,
		},
	},
	'basic:vendors-3': {
		message: 'supports { minimumVendorImplementations: 3, enableClientSidePolyfills: false } usage',
		options: {
			stage: 1,
			minimumVendorImplementations: 3,
			enableClientSidePolyfills: false,
		},
	},
	'basic:nesting:true': {
		message: 'supports { stage: false, features: { "nesting-rules": true } } usage',
		options: {
			stage: false,
			features: {
				'nesting-rules': true,
			},
		},
	},
	'basic:nesting:false': {
		message: 'supports { stage: 0, features: { "nesting-rules": false } } usage',
		options: {
			stage: 0,
			features: {
				'nesting-rules': false,
			},
		},
	},
	'basic:autoprefixer': {
		message: 'supports { autoprefixer: { add: false } } usage',
		options: {
			autoprefixer: {
				add: false,
			},
		},
	},
	'basic:autoprefixer:false': {
		message: 'supports { autoprefixer: false } usage',
		options: {
			autoprefixer: false,
		},
	},
	'basic:autoprefixer:remove:false': {
		message: 'supports { autoprefixer: { remove: false } } usage',
		options: {
			autoprefixer: {
				remove: false,
			},
		},
	},
	'basic:preserve:true': {
		message: 'supports { preserve: true, stage: 0, browsers: "> 0%" } usage',
		options: {
			preserve: true,
			stage: 0,
			browsers: '> 0%',
		},
	},
	'basic:preserve:false': {
		message: 'supports { preserve: false, stage: 0, browsers: "> 0%" } usage',
		options: {
			preserve: false,
			stage: 0,
			browsers: '> 0%',
		},
	},
	'basic:hebrew': {
		message: 'supports { logical: { inlineDirection: "right-to-left" }, stage: 0, browsers: "> 0%" } usage',
		options: {
			stage: 0,
			logical: {
				inlineDirection: 'right-to-left',
			},
		},
	},
	'basic:hebrew:all-browsers-have-support': {
		message: 'supports { logical: { inlineDirection: "right-to-left" }, stage: 0, browsers: "> 0%" } usage',
		options: {
			stage: 0,
			browsers: 'Chrome 114',
			logical: {
				inlineDirection: 'right-to-left',
			},
		},
	},
	'layers-basic': {
		message: 'supports layers usage',
		options: {
			stage: 0,
			browsers: '> 0%',
		},
		warnings: 0,
	},
	'layers-basic:preserve:true': {
		message: 'supports layers usage with { preserve: true }',
		options: {
			preserve: true,
			stage: 0,
			browsers: '> 0%',
		},
		warnings: 0,
	},
	'client-side-polyfills:stage-1': {
		message: 'stable client side polyfill behavior',
		options: {
			preserve: false,
			stage: 1,
			enableClientSidePolyfills: true,
		},
	},
	'client-side-polyfills:stage-2': {
		message: 'stable client side polyfill behavior',
		options: {
			preserve: false,
			stage: 2,
			enableClientSidePolyfills: true,
		},
	},
	'client-side-polyfills:stage-3': {
		message: 'stable client side polyfill behavior',
		options: {
			preserve: false,
			stage: 3,
			enableClientSidePolyfills: true,
		},
	},
	'client-side-polyfills:stage-4': {
		message: 'stable client side polyfill behavior',
		options: {
			preserve: false,
			stage: 4,
			enableClientSidePolyfills: true,
		},
	},
	'custom-properties': {
		message: 'supports { browsers: "ie >= 10" } usage',
		options: {
			browsers: 'ie >= 10',
		},
	},
	'custom-properties:disabled': {
		message: 'supports { browsers: "ie >= 10", features: { "custom-properties": false } } usage',
		options: {
			browsers: 'ie >= 10',
			features: {
				'custom-properties': false,
			},
		},
	},
	'custom-properties:enabled': {
		message: 'supports { browsers: "chrome >= 60", features: { "custom-properties": true } } usage',
		options: {
			browsers: 'chrome >= 60',
			features: {
				'custom-properties': true,
			},
		},
	},
	'enable-client-side-polyfills': {
		message: 'supports { enableClientSidePolyfills: false } usage',
		options: {
			enableClientSidePolyfills: false,
			stage: 0,
		},
	},
	'enable-client-side-polyfills:enabled': {
		message: 'supports { enableClientSidePolyfills: true } usage (default)',
		options: {
			enableClientSidePolyfills: true,
			stage: 0,
		},
	},
	'insert:baseline': {
		message: 'supports { insertBefore/insertAfter } usage baseline',
		options: {
			stage: 0,
			features: {
				'lab-function': true,
				'color-function': false,
			},
		},
	},
	'insert:before:match-source': {
		message: 'supports { insertBefore } usage when looking for source',
		options: {
			stage: 0,
			features: {
				'lab-function': true,
				'color-function': false,
			},
			insertBefore: {
				'lab-function': [
					orderDetectionPlugin('before', (decl) => {
						return decl.prop === 'color' && decl.value.indexOf('lab(') === 0;
					}),
				],
			},
		},
	},
	'insert:before:match-result': {
		message: 'supports { insertBefore } usage when looking for a result',
		options: {
			stage: 0,
			features: {
				'lab-function': true,
				'color-function': false,
			},
			insertBefore: {
				'lab-function': [
					orderDetectionPlugin('before', (decl) => {
						return decl.prop === 'color' && decl.value.indexOf('rgb(') === 0;
					}),
				],
			},
		},
	},
	'insert:after:match-source': {
		message: 'supports { insertAfter } usage when looking for source',
		options: {
			stage: 0,
			features: {
				'lab-function': true,
				'color-function': false,
			},
			insertAfter: {
				'lab-function': [
					orderDetectionPlugin('after', (decl) => {
						return decl.prop === 'color' && decl.value.indexOf('lab(') === 0;
					}),
				],
			},
		},
	},
	'insert:after:match-result': {
		message: 'supports { insertAfter } usage when looking for a result',
		options: {
			stage: 0,
			features: {
				'lab-function': true,
				'color-function': false,
			},
			insertAfter: {
				'lab-function': [
					orderDetectionPlugin('after', (decl) => {
						return decl.prop === 'color' && decl.value.indexOf('rgb(') === 0;
					}),
				],
			},
		},
	},
	'insert:after:match-result:no-array': {
		message: 'supports { insertAfter with a single plugin, not an array } usage when looking for a result',
		options: {
			stage: 0,
			features: {
				'lab-function': true,
				'color-function': false,
			},
			insertAfter: {
				'lab-function': orderDetectionPlugin('after', (decl) => {
					return decl.prop === 'color' && decl.value.indexOf('rgb(') === 0;
				}),
			},
		},
	},
	'insert:before:match-result:feature-is-skipped': {
		message: 'supports { insertBefore } usage when looking for a result and the attached feature is skipped',
		options: {
			stage: 0,
			browsers: [
				'safari >= 15',
			],
			insertBefore: {
				'lab-function': [
					orderDetectionPlugin('before', (decl) => {
						return decl.prop === 'color' && decl.value !== 'changed-this-declaration';
					}),
				],
			},
		},
	},
	'insert:after:match-result:feature-is-skipped': {
		message: 'supports { insertAfter } usage when looking for a result and the attached feature is skipped',
		options: {
			stage: 0,
			browsers: [
				'safari >= 15',
			],
			insertAfter: {
				'lab-function': [
					orderDetectionPlugin('after', (decl) => {
						return decl.prop === 'color' && decl.value !== 'changed-this-declaration';
					}),
				],
			},
		},
	},
	'logical-properties': {
		message: 'supports all known logical properties',
		options: {
			autoprefixer: false,
			stage: 0,
			browsers: '> 0%',
		},
	},
	'progressive-custom-properties': {
		message: 'supports progressive custom properties plugin',
		options: {
			preserve: true,
			stage: 0,
			browsers: '> 0%',
		},
	},
	'unknown-feature': {
		message: 'warns on unknown features',
		warnings: 4,
		options: {
			features: {
				'custom-media': true,
				'postcss-logical': true,
				'postcss-logica': true,
				'environment-variables': true,
			},
		},
	},
	'postcss-import/styles': {
		message: 'works well with "postcss-bundler"',
		plugins: [
			postcssBundler(),
			plugin({
				stage: 0,
				browsers: '> 0%',
			}),
		],
	},
});
