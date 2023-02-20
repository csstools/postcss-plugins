import { postcssTape } from '../../packages/postcss-tape/dist/index.mjs';
import plugin from 'postcss-custom-properties';
import postcssImport from 'postcss-import';

postcssTape(plugin)({
	'basic': {
		message: 'supports basic usage'
	},
	'basic:preserve': {
		message: 'supports { preserve: false } usage',
		options: {
			preserve: false
		}
	},
	'cascade-layers': {
		message: 'supports cascade layers'
	},
	'chained': {
		message: 'supports chained variables'
	},
	'issue-838': {
		message: 'prevent regressions of https://github.com/csstools/postcss-plugins/issues/838',
		options: {
			preserve: false
		}
	},
	'examples/example': {
		message: 'minimal example',
	},
	'examples/example:preserve-false': {
		message: 'minimal example with { preserve: false }',
		options: {
			preserve: false
		}
	},
	'import': {
		message: 'supports "postcss-import"',
		plugins: [postcssImport(), plugin()]
	}
});
