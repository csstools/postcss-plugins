import postcssTape from '../../packages/postcss-tape/dist/index.mjs';
import plugin from 'postcss-selector-not';

postcssTape(plugin)({
	basic: {
		message: "supports basic usage",
	},
	'examples/example': {
		message: 'minimal example',
	},
});
