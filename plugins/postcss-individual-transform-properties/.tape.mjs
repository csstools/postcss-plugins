import postcssTape from '../../packages/postcss-tape/dist/index.mjs';
import plugin from '@csstools/postcss-individual-transform-properties';

postcssTape(plugin)({
	basic: {
		message: "supports basic usage",
	},
	"leave-as-is": {
		message: "does not alter stylesheets without individual properties",
	},
	'examples/example': {
		message: 'minimal example',
	},
	'examples/example:preserve-true': {
		message: 'minimal example',
		options: {
			preserve: true
		}
	},
});
