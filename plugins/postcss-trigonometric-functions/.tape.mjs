import postcssTape from '../../packages/postcss-tape/dist/index.mjs';
import plugin from '@csstools/postcss-trigonometric-functions';

postcssTape(plugin)({
	basic: {
		message: "supports basic usage",
	},
});
