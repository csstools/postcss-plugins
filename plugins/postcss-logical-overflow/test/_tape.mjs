import { postcssTape } from '@csstools/postcss-tape';
import plugin from '@csstools/postcss-logical-overflow';

postcssTape(plugin)({
	basic: {
		message: 'supports basic usage',
	},
	'basic:rtl': {
		message: 'basic test with rtl',
		options: {
			inlineDirection: 'right-to-left',
		},
	},
	'basic:chinese': {
		message: 'basic test with rtl and bt',
		options: {
			inlineDirection: 'top-to-bottom',
		},
	},
	'examples/example': {
		message: 'minimal example',
	},
	'examples/example:chinese': {
		message: 'minimal example',
		options: {
			inlineDirection: 'top-to-bottom',
		},
	},
});
