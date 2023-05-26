import { postcssTape } from '@csstools/postcss-tape';
import plugin from '@csstools/postcss-progressive-custom-properties';

postcssTape(plugin)({
	basic: {
		message: "supports basic usage",
	},
});
