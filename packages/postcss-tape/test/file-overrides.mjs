import { postcssTape } from '../dist/index.mjs';
import plugin from './_a-plugin.mjs';

postcssTape(plugin)({
	'not-this': {
		message: 'supports file overrides',
		source: 'file-overrides.scss',
		expect: 'file-overrides.expect.css',
		result: 'file-overrides.result.css',
		options: {
			selector: '.file-overrides',
		},
	},
});
