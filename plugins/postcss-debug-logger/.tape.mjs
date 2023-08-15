import { postcssTape } from '@csstools/postcss-tape';
import plugin from '@csstools/postcss-debug-logger';

postcssTape(plugin)({
	basic: {
		message: "supports basic usage",
		options: {}
	},
});
