import { postcssTape } from '@csstools/postcss-tape';
import plugin from 'postcss-browser-comments';

postcssTape(plugin)({
	basic: {
		message: 'supports basic usage',
		options: {
			browsers: ['IE 11', 'Safari >= 8', 'Firefox >= 50', 'Chrome >= 50'],
		},
	},
	'basic:ie': {
		message: 'supports IE',
		options: {
			browsers: ['IE > 0'],
		},
	},
	'basic:ie-10': {
		message: 'supports IE 10',
		options: {
			browsers: ['IE 10'],
		},
	},
	'examples/example-1': {
		message: 'minimal example',
		options: {
			browsers: ['last 2 Chrome versions'],
		},
	},
	'examples/example-2': {
		message: 'minimal example',
		options: {
			browsers: ['last 2 Firefox versions'],
		},
	},
});
