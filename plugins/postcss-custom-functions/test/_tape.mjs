import { postcssTape } from '@csstools/postcss-tape';
import plugin from '@csstools/postcss-custom-functions';

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
	nested: {
		message: 'supports nested calls and dynamic scoping',
	},
	'conditionals': {
		message: 'supports conditional rules',
	},
	'invalid': {
		message: 'handles invalid invocations',
	},
	'ignore': {
		message: 'ignores unsupported functions',
		expect: 'ignore.css',
		result: 'ignore.css',
	},
	'ignore:preserve-true': {
		message: 'ignores unsupported functions with { preserve: true }',
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
		message: 'minimal example with { preserve: true }',
		options: {
			preserve: true,
		},
	},
});
