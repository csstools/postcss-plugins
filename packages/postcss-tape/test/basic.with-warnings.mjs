import { postcssTape } from '../dist/index.mjs';
import plugin from './_a-plugin.mjs';


postcssTape(plugin)({
	'basic:with-one-warning': {
		message: 'supports basic usage',
		plugins: [plugin({ warn: true })],
		warnings: 1,
	},
	'basic:with-one-missing-warning': {
		message: 'supports basic usage',
		plugins: [plugin({ warn: false })],
		warnings: 1,
	},
	'basic:with-one-unexpected-warning': {
		message: 'supports basic usage',
		plugins: [plugin({ warn: true })],
		warnings: 0,
	},
	'basic:with-multiple-warnings': {
		message: 'supports basic usage',
		plugins: [plugin({ warn: true }), plugin({ warn: true }), plugin({ warn: true })],
		warnings: 7,
	},
});
