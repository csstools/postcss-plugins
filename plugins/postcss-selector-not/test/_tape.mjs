import { postcssTape } from '@csstools/postcss-tape';
import plugin from 'postcss-selector-not';

postcssTape(plugin)({
	basic: {
		message: 'supports basic usage',
	},
	'examples/example': {
		message: 'minimal example',
	},
});
