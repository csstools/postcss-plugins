import postcssTape from '../../packages/postcss-tape/dist/index.mjs';
import plugin from '@csstools/postcss-design-tokens';
import postcssImport from 'postcss-import';

postcssTape(plugin)({
	basic: {
		message: "supports basic usage",
		options: {},
		plugins: [
			postcssImport(),
			plugin()
		]
	},
	'errors': {
		message: "handles issues correctly",
		options: {},
		warnings: 4
	},
	'is': {
		message: "supports basic usage",
		options: {
			is: ['dark', 'tablet', 'branded-green']
		}
	},
	'examples/example': {
		message: 'minimal example',
		options: {},
	},
	'examples/example-conditional': {
		message: 'minimal example with conditional imports : default',
		options: {},
	},
	'examples/example-conditional:dark': {
		message: 'minimal example with conditional imports : dark',
		options: {
			is: ['dark']
		},
	},
});
