import { postcssTape } from '../dist/index.mjs';
import plugin from './_a-plugin.mjs';


postcssTape(plugin)({
	'basic:without-expect': {
		message: 'supports basic usage',
	},
});
