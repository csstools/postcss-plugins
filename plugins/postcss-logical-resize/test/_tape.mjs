import { postcssTape } from '@csstools/postcss-tape';
import plugin from '@csstools/postcss-logical-resize';

postcssTape(plugin)({
	'basic': {
		message: 'basic test with default setting',
	},
	'basic:rtl': {
		message: 'basic test with rtl',
		options: {
			inlineDirection: 'right-to-left',
		},
	},
	'basic:bt': {
		message: 'basic test with bt',
		options: {
			blockDirection: 'bottom-to-top',
		},
	},
	'basic:rtl-and-bt': {
		message: 'basic test with rtl and bt',
		options: {
			blockDirection: 'bottom-to-top',
			inlineDirection: 'right-to-left',
		},
	},
	'basic:chinese': {
		message: 'basic test with rtl and bt',
		options: {
			blockDirection: 'right-to-left',
			inlineDirection: 'top-to-bottom',
		},
	},
	'examples/example': {
		message: 'minimal example',
	},
	'examples/example:chinese': {
		message: 'minimal example',
		options: {
			blockDirection: 'right-to-left',
			inlineDirection: 'top-to-bottom',
		},
	},
});
