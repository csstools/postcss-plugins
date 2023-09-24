import { postcssTape } from '@csstools/postcss-tape';
import plugin from 'postcss-custom-properties';
import postcssBundler from '@csstools/postcss-bundler';

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
	'specificity': {
		message: 'supports different specificities of html and :root selectors'
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
		message: 'supports "postcss-bundler"',
		plugins: [postcssBundler(), plugin()]
	}
});
