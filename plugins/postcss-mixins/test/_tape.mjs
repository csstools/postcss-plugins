import { postcssTape } from '@csstools/postcss-tape';
import plugin from '@csstools/postcss-mixins';

postcssTape(plugin)({
	basic: {
		message: 'supports basic usage',
	},
	'basic:preserve-true': {
		message: 'supports basic usage with { preserve: true }',
		options: {
			preserve: true,
		},
	},
	ignore: {
		message: 'ignores invalid or unsupported behavior',
		expect: 'ignore.css',
		result: 'ignore.css',
	},
	'ignore:preserve-true': {
		message: 'ignores invalid or unsupported behavior with { preserve: true }',
		expect: 'ignore.css',
		result: 'ignore.css',
		options: {
			preserve: true,
		},
	},
	'examples/example': {
		message: 'minimal example',
	},
	'examples/example:preserve-true': {
		message: 'minimal example',
		options: {
			preserve: true,
		},
	},
});
