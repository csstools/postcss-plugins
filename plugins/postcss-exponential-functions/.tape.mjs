import { postcssTape } from '@csstools/postcss-tape';
import plugin from '@csstools/postcss-exponential-functions';

postcssTape(plugin)({
	basic: {
		message: "supports basic usage",
	},
	'basic:preserve': {
		message: "supports basic usage",
		options: {
			preserve: true
		}
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
