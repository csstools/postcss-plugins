const postcssTape = require('../../packages/postcss-tape/dist/index.cjs');
const plugin = require('postcss-custom-properties');

postcssTape(plugin)({
	'basic:import-cjs': {
		message: 'supports { importFrom: "test/import-properties{-2}?.cjs" } usage',
		warnings: 1,
		options: {
			importFrom: [
				'test/import-properties.cjs',
				'test/import-properties-2.cjs'
			]
		},
		expect: 'basic.import.expect.css',
		result: 'basic.import.result.css'
	},
	'basic:import-css-js': {
		message: 'supports { importFrom: "test/import-properties{-2}?.{css|js}" } usage',
		warnings: 1,
		options: {
			importFrom: [
				'test/import-properties.js',
				'test/import-properties-2.css'
			]
		},
		expect: 'basic.import.expect.css',
		result: 'basic.import.result.css'
	}
});
