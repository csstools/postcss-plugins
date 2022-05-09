import postcssTape from '../../packages/postcss-tape/dist/index.mjs';
import plugin from '@csstools/postcss-cascade-layers';

postcssTape(plugin)({
	basic: {
		message: "supports basic usage",
	},
	'basic:color': {
		message: "supports { color: '<a color>' }",
		options: {
			color: 'purple'
		}
	},
	atrules: {
		message: "supports @keyframes usage",
	},
	nested: {
		message: "supports nested layer usage",
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
	'examples/example': {
		message: "minimal example",
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
		},
		warnings: 2,
	}
});
