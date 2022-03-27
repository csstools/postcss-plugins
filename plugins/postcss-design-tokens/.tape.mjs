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
	'variants': {
		message: "supports basic usage",
		options: {
			variants: ['dark', 'tablet', 'branded-green']
		}
	},
	'examples/example': {
		message: 'minimal example',
		options: {},
	},
	'examples/example:dark': {
		message: 'minimal example with dark theme',
		options: {
			variants: [
				'dark'
			]
		},
	},
});
