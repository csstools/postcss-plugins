import postcssTape from '../../packages/postcss-tape/dist/index.mjs';
import plugin from '@csstools/postcss-nested-calc';

postcssTape(plugin)({
	basic: {
		message: "supports basic usage",
	},
	'basic:preserve-false': {
		message: "supports basic usage with { preserve: false }",
		options: {
			preserve: false
		}
	},
	'examples/example': {
		message: 'minimal example',
	},
	'examples/example:preserve-false': {
		message: 'minimal example',
		options: {
			preserve: false
		}
	},
});
