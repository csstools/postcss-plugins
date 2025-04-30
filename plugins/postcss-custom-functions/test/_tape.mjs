import { postcssTape } from '@csstools/postcss-tape';
import plugin from '@csstools/postcss-custom-functions';

postcssTape(plugin)({
	basic: {
		message: 'supports basic usage',
	},
	'basic:color': {
		message: 'supports { color: \'<a color>\' }',
		options: {
			color: 'purple',
		},
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
