import postcssTape from '../../packages/postcss-tape/dist/index.mjs';
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
	'import': {
		message: 'supports "postcss-import"',
		plugins: [postcssImport(), plugin()]
	}
});
