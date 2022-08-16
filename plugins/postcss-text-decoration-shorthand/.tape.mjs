import postcssTape from '../../packages/postcss-tape/dist/index.mjs';
import plugin from '@csstools/postcss-text-decoration-shorthand';
import autoprefixer from 'autoprefixer';

postcssTape(plugin)({
	basic: {
		message: "supports basic usage",
	},
	'basic:preserve-true': {
		message: 'supports basic usage with { preserve: true }',
		options: {
			preserve: true
		}
	},
	'basic:autoprefixer': {
		message: 'supports basic usage with autoprefixer and { preserve: true }',
		plugins: [
			plugin({
				preserve: true
			}),
			autoprefixer({
				overrideBrowserslist: ['Safari >= 8']
			})
		]
	},
	'examples/example': {
		message: 'minimal example',
	},
	'examples/example:preserve-true': {
		message: 'minimal example',
		options: {
			preserve: true
		}
	},
});
