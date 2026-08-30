import { postcssTape } from '@csstools/postcss-tape';
import plugin from '@csstools/postcss-private-rule';

postcssTape(plugin)({
	basic: {
		message: 'supports basic usage',
	},
	'examples/example': {
		message: 'minimal example',
	},
});
