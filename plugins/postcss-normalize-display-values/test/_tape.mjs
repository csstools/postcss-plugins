import { postcssTape } from '@csstools/postcss-tape';
import plugin from '@csstools/postcss-normalize-display-values';

postcssTape(plugin)({
	basic: {
		message: 'supports basic usage',
	},
	'basic:preserve-false': {
		message: 'supports basic usage with { preserve: true }',
		options: {
			preserve: false,
		},
	},
});
