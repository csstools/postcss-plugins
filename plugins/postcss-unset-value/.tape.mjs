import postcssTape from '../../packages/postcss-tape/dist/index.mjs';
import plugin from '@csstools/postcss-unset-value';

postcssTape(plugin)({
	basic: {
		message: "supports basic usage",
	},
	'basic:preserve:true': {
		message: "supports basic usage",
		options: {
			preserve: true,
		}
	},
	'generated-value-cases': {
		message: "supports generated value cases",
		options: {
			preserve: true
		}
	},
	example: {
		message: "minimal example",
	},
});
