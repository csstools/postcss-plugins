import { postcssTape } from '@csstools/postcss-tape';
import plugin from '@csstools/postcss-bundler';

postcssTape(plugin)({
	basic: {
		message: "supports basic usage",
	},
	'examples/example': {
		message: 'minimal example',
	},
});
