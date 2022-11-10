import postcssTape from '../../packages/postcss-tape/dist/index.mjs';
import plugin from 'postcss-attribute-case-insensitive';

postcssTape(plugin)({
	basic: {
		message: "supports basic usage",
	},
	'invalid-selector': {
		message: 'warns on invalid selectors',
		warnings: 1
	},
	'examples/example': {
		message: 'minimal example',
	},
});
