import { postcssTape } from '@csstools/postcss-tape';
import plugin from '@csstools/postcss-text-decoration-shorthand';
import autoprefixer from 'autoprefixer';

postcssTape(plugin)({
	basic: {
		message: 'supports basic usage',
	},
	'basic:preserve-false': {
		message: 'supports basic usage with { preserve: false }',
		options: {
			preserve: false,
		},
	},
	'basic:autoprefixer': {
		message: 'supports basic usage with autoprefixer',
		plugins: [
			plugin(),
			autoprefixer({
				overrideBrowserslist: ['Safari >= 8'],
			}),
		],
	},
	'basic:autoprefixer:preserve-false': {
		message: 'supports basic usage with autoprefixer and { preserve: false }',
		plugins: [
			plugin({
				preserve: false,
			}),
			autoprefixer({
				overrideBrowserslist: ['Safari >= 8'],
			}),
		],
	},
	'multiple-declarations:autoprefixer': {
		message: 'supports basic usage with autoprefixer',
		plugins: [
			plugin(),
			autoprefixer({
				overrideBrowserslist: ['Safari >= 8'],
			}),
		],
	},
	'examples/example': {
		message: 'minimal example',
	},
	'examples/example:preserve-false': {
		message: 'minimal example',
		options: {
			preserve: false,
		},
	},
});
