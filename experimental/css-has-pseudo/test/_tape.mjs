import { postcssTape } from '@csstools/postcss-tape';
import plugin from '@csstools/css-has-pseudo-experimental';

postcssTape(plugin)({
	'basic': {
		message: 'supports basic usage',
		warnings: 1,
	},
});
