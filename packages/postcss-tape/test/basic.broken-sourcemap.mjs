import { postcssTape } from '../dist/index.mjs';
import plugin from './_a-plugin.mjs';


postcssTape(plugin)({
	'basic:broken-sourcemap': {
		message: 'supports basic usage',
		options: {
			break_sourcemap: true,
		},
	},
});
