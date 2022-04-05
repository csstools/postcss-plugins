import postcssTape from '../../packages/postcss-tape/dist/index.mjs';
import plugin from 'postcss-gap-properties';

postcssTape(plugin)({
	'basic': {
		message: 'supports basic usage'
	},
	'basic:preserve-false': {
		message: 'supports { preserve: false } usage',
		options: {
			preserve: false
		}
	},
	'ignore-flexbox': {
		message: 'ignore flexbox declarations'
	},
	'ignore-multicolumn': {
		message: 'ignore multi column declarations'
	}
});
