import postcssTape from '../../packages/postcss-tape/dist/index.mjs';
import plugin from '@csstools/postcss-progressive-custom-properties';

postcssTape(plugin)({
	basic: {
		message: "supports basic usage",
	},
	example: {
		message: "minimal example",
	},
});
