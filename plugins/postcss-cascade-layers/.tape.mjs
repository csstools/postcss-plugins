import postcssTape from '../../packages/postcss-tape/dist/index.mjs';
import plugin from '@csstools/postcss-cascade-layers';
import postcssImport from 'postcss-import';

postcssTape(plugin)({
	basic: {
		message: "supports basic usage",
	},
	atrules: {
		message: "supports @keyframes usage",
	},
	'container-scope--reference': {
		message: "Layered styles without @container or @scope but with the same layers and layer order as the @container/@scope test",
	},
	'container-scope': {
		message: "Layered styles with @container or @scope, these at rules are expected not to have any effect on the final order or specificity",
	},
	nested: {
		message: "supports nested layer usage",
	},
	'nested-case-insensitive': {
		message: "supports layer and other keywords written in any case",
	},
	'nested-complex': {
		message: "supports nested layer usage",
	},
	important: {
		message: "supports important usage",
	},
	'anon-layer': {
		message: "supports anonymous layer usage",
	},
	'invalid-nested-css': {
		message: "ignores nested css",
	},
	'extensions': {
		message: "css custom extensions",
	},
	'pre-defined-order-for-nested-layer': {
		message: 'supports pre-defined orders for nested layers'
	},
	'unlayered-styles': {
		message: 'supports unlayered styles alongside layers',
	},
	'invalid-rules': {
		message: 'correctly handles invalid rules',
	},
	'warnings': {
		message: 'correctly handles warnings',
		options: {
			onRevertLayerKeyword: 'warn',
			onConditionalRulesChangingLayerOrder: 'warn',
			onImportLayerRule: 'warn'
		},
		warnings: 4,
	},
	'warnings:with-postcss-import': {
		message: 'correctly handles warnings when postcss-import is used',
		options: {
			onRevertLayerKeyword: 'warn',
			onConditionalRulesChangingLayerOrder: 'warn',
			onImportLayerRule: 'warn'
		},
		warnings: 2,
		plugins: [
			postcssImport({
				nameLayer: (index) => {
					return `anon-layer-import--${index}`;
				}
			}), /* postcss-import must run first */
			plugin(),
		]
	},
	'where': {
		message: "works with zero specificity selectors",
	},
	'specificity-buckets-a': {
		message: "creates non overlapping specificity buckets",
	},
	'specificity-buckets-b': {
		message: "creates non overlapping specificity buckets",
	},
	'examples/example': {
		message: "minimal example",
	},
});
