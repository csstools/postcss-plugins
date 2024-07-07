import { postcssTape } from '@csstools/postcss-tape';
import plugin from '@csstools/postcss-content-alt-text';

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
	'basic:strip-alt-text': {
		message: 'supports basic usage with { stripAltText: true }',
		options: {
			stripAltText: true,
		},
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
	'examples/example:strip-alt-text': {
		message: 'minimal example',
		options: {
			stripAltText: true,
		},
	},
});
