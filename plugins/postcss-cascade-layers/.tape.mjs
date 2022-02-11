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
});
