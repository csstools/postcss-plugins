import { postcssTape } from '@csstools/postcss-tape';
import plugin from '@csstools/postcss-rebase-url';
import postcssImport from 'postcss-import';

import './unit/index.mjs';

await postcssTape(plugin)({
	basic: {
		message: 'supports basic usage',
		plugins: [
			postcssImport(),
			plugin(),
		],
	},
	'examples/example': {
		message: 'minimal example',
		plugins: [
			postcssImport(),
			plugin(),
		],
	},
});
