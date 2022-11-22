const postcssTape = require('../../packages/postcss-tape/dist/index.cjs');
const plugin = require('@csstools/postcss-custom-properties-import-export');

postcssTape(plugin)({
	'basic:import-cjs': {
		message: 'supports { importFrom: "test/import-properties{-2}?.cjs" } usage',
		options: {
			importFrom: [
				'test/import-properties.cjs',
				'test/import-properties-2.cjs'
			]
		},
	},
	'basic:import-css-js': {
		message: 'supports { importFrom: "test/import-properties{-2}?.{css|js}" } usage',
		options: {
			importFrom: [
				'test/import-properties.js',
				'test/import-properties-2.css'
			]
		},
	}
});
