import postcssTape from '../../packages/postcss-tape/dist/index.mjs';
import plugin from '@csstools/postcss-conditional-values';

postcssTape(plugin)({
	basic: {
		message: "supports basic usage",
	},
	'default-false': {
		message: "supports default false in :root{}",
	},
	'pre-existing-false': {
		message: "supports default false in :root{}",
	},
	'complex': {
		message: "supports complex usage",
	},
	'examples/example': {
		message: 'minimal example',
	},
	'examples/example-custom-function-name': {
		message: 'minimal example with { functionName: "if" }',
		options: {
			functionName: 'if'
		}
	},
});
