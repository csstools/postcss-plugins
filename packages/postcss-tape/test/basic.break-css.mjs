import { postcssTape } from '../dist/index.mjs';
import plugin from './_a-plugin.mjs';
import fs from 'node:fs/promises';

postcssTape(plugin)({
	'basic:break-css': {
		message: 'supports basic usage',
		after: async () => {
			await fs.writeFile('./test/basic.break-css.result.css', '<hello>world</hello>');
		},
	},
});
