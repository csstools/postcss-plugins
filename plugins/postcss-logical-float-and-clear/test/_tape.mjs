import { postcssTape } from '@csstools/postcss-tape';
import plugin from '@csstools/postcss-logical-float-and-clear';

postcssTape(plugin)({
	basic: {
		message: 'supports basic usage',
	},
	'basic:hebrew': {
		message: 'supports { inlineDirection: \'right-to-left\' }',
		options: {
			inlineDirection: 'right-to-left',
		},
	},
	'basic:vertical': {
		message: 'supports { inlineDirection: \'top-to-bottom\' }',
		options: {
			inlineDirection: 'top-to-bottom',
		},
	},
	'examples/example': {
		message: 'minimal example',
	},
	'examples/example:hebrew': {
		message: 'minimal example',
		options: {
			inlineDirection: 'right-to-left',
		},
	},
});
