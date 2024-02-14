import { postcssTape } from '../dist/index.mjs';
import plugin from './_c-plugin.mjs';

postcssTape(plugin)({
	'type-checking': {
		message: 'warns when plugins mangle PostCSS AST typings',
	},
});
