import { postcssTape } from '../dist/index.mjs';
import plugin from './_a-plugin.mjs';

postcssTape(plugin)({
	'basic': {
		message: 'supports basic usage',
	},
});
