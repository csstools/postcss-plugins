import plugin from '@csstools/postcss-url';
import postcssImport from 'postcss-import';
import { postcssTape } from '@csstools/postcss-tape';

import './test/unit/index.mjs';

await postcssTape(plugin)({
	basic: {
		message: "supports basic usage",
		plugins: [
			postcssImport(),
			plugin()
		]
	},
	'examples/example': {
		message: 'minimal example',
		plugins: [
			postcssImport(),
			plugin()
		]
	}
});
