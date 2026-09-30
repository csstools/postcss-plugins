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
	arguments: {
		message: 'supports mixin arguments',
	},
	'arguments:preserve-true': {
		message: 'supports mixin arguments with { preserve: true }',
		options: {
			preserve: true,
		},
	},
	contents: {
		message: 'supports @contents',
	},
	'contents:preserve-true': {
		message: 'supports @contents with { preserve: true }',
		options: {
			preserve: true,
		},
	},
	'nested-mixins': {
		message: 'supports mixins applied within mixins',
	},
	'nested-mixins:preserve-true': {
		message: 'supports mixins applied within mixins with { preserve: true }',
		options: {
			preserve: true,
		},
	},
	nesting: {
		message: 'preserves author written nesting rules',
	},
	'nesting:preserve-true': {
		message: 'preserves author written nesting rules with { preserve: true }',
		options: {
			preserve: true,
		},
	},
	private: {
		message: 'scopes mixin parameters and @private rules',
	},
	'private:preserve-true': {
		message: 'scopes mixin parameters and @private rules with { preserve: true }',
		options: {
			preserve: true,
		},
	},
	invalid: {
		message: 'ignores invalid mixin invocations',
	},
	'invalid:preserve-true': {
		message: 'ignores invalid mixin invocations with { preserve: true }',
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
