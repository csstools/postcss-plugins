import { postcssTape } from '../dist/index.mjs';
import plugin from './_a-plugin.mjs';


postcssTape(plugin)({
	'basic:with-diff-in-expect': {
		message: 'supports basic usage',
	},
});
