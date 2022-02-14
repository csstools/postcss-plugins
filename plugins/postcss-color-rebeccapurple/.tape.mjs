import postcssTape from '../../packages/postcss-tape/dist/index.mjs';
import plugin from 'postcss-color-rebeccapurple';

postcssTape(plugin)({
	'basic': {
		message: 'supports basic usage'
	},
	'basic:preserve-true': {
		message: 'supports { preserve: true } usage',
		options: {
			preserve: true
		}
	}
});
