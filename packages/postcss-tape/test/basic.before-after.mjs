import { postcssTape } from '../dist/index.mjs';
import plugin from './_a-plugin.mjs';
import fs from 'node:fs/promises';

let original = '';

postcssTape(plugin)({
	'basic:before-after': {
		message: 'supports basic usage',
		options: {
			selector: '.foos',
		},
		before: async () => {
			if (original === '') {
				original = await fs.readFile('./test/basic.css', 'utf8');
			}
			await fs.writeFile('./test/basic.css', '.foos { order: 1; }');
		},
		after: async () => {
			await fs.writeFile('./test/basic.css', original);
			original = '';
		},
	},
});
