import { postcssTape } from '../dist/index.mjs';
import plugin from './_a-plugin.mjs';
import { promises as fsp } from 'fs';

let original = '';

postcssTape(plugin)({
	'basic:before-after': {
		message: 'supports basic usage',
		options: {
			selector: '.foos',
		},
		before: async () => {
			if (original === '') {
				original = await fsp.readFile('./test/basic.css', 'utf8');
			}
			await fsp.writeFile('./test/basic.css', '.foos { order: 1; }');
		},
		after: async () => {
			await fsp.writeFile('./test/basic.css', original);
			original = '';
		},
	},
});
