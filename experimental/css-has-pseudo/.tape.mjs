import { postcssTape } from '../../packages/postcss-tape/dist/index.mjs';
import plugin from '@csstools/css-has-pseudo-experimental';

postcssTape(plugin)({
	'basic': {
		message: 'supports basic usage',
		warnings: 1
	},
});
