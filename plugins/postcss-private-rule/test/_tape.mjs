import { postcssTape } from '@csstools/postcss-tape';
import plugin from '@csstools/postcss-private-rule';

postcssTape(plugin)({
	basic: {
		message: 'supports basic usage',
	},
	nesting: {
		message: 'supports complex nested rules',
	},
	encoding: {
		message: 'all encoded values are valid css',
	},
	'examples/example': {
		message: 'minimal example',
	},
});
