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
});
