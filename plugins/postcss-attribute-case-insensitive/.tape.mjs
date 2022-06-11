import postcssTape from '../../packages/postcss-tape/dist/index.mjs';
import plugin from 'postcss-attribute-case-insensitive';

postcssTape(plugin)({
	basic: {
		message: "supports basic usage",
	},
	'examples/example': {
		message: 'minimal example',
	},
});
