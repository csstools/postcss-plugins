import { postcssTape } from '@csstools/postcss-tape';
import plugin from '@csstools/postcss-normalize-display-values';

postcssTape(plugin)({
	basic: {
		message: 'supports basic usage',
	},
	'basic:preserve-false': {
		message: 'supports variables with { preserve: true } usage',
		options: {
			preserve: false
		}
	},
});
