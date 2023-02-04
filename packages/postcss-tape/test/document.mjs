import { postcssTape } from '../dist/index.mjs';
import plugin from './_b-plugin.mjs';

postcssTape(plugin)({
	'document': {
		postcssSyntaxHTML: true,
		message: 'supports basic usage',
	},
});
