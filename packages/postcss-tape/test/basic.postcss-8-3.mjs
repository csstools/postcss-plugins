import postcssTape from '../dist/index.mjs';
import plugin from './_a-plugin.mjs';


postcssTape(plugin)({
	'basic:postcss-8-3': {
		message: 'supports basic usage',
		options: {
			postcss8_3_api_call: true,
		},
	},
});
