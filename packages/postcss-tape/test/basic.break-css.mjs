import { postcssTape } from '../dist/index.mjs';
import plugin from './_a-plugin.mjs';
import { promises as fsp } from 'fs';

postcssTape(plugin)({
	'basic:break-css': {
		message: 'supports basic usage',
		after: async () => {
			await fsp.writeFile('./test/basic.break-css.result.css', '<hello>world</hello>');
		},
	},
});
