import postcssTape from '@csstools/postcss-tape';
import plugin from '@csstools/postcss-base-plugin';

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
