import { postcssTape } from '@csstools/postcss-tape';
import plugin from '@csstools/postcss-system-ui-font-family';

postcssTape(plugin)({
	basic: {
		message: 'supports basic usage',
	},
	'examples/example': {
		message: 'minimal example',
	},
	'examples/example:preserve-false': {
		message: 'minimal example',
		options: {
			preserve: false,
		},
	},
});
