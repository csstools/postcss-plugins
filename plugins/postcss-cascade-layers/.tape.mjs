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
	example: {
		message: "minimal example",
	},
	nested: {
		message: "supporting nested layer usage",
	},
	'anon-layer': {
		message: "supporting anonymous layer usage",
	},
	nested: {
		message: "supporting nested layer usage",
	},
});
