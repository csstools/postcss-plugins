import { postcssTape } from '@csstools/postcss-tape';
import plugin from '@csstools/postcss-private-rule';
import bundler from '@csstools/postcss-bundler';

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
	bundled: {
		message: 'all encoded values are valid css',
		plugins: [
			bundler(),
			plugin(),
		],
	},
	'examples/example': {
		message: 'minimal example',
	},
});
