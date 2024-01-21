import { postcssTape } from '@csstools/postcss-tape';
import plugin from '@csstools/postcss-gradient-stop-increments-experimental';

postcssTape(plugin)({
	basic: {
		message: 'supports basic usage',
	},
	'examples/example': {
		message: 'minimal example',
	},
	'examples/example:preserve-true': {
		message: 'minimal example',
		options: {
			preserve: true,
		},
	},
});
