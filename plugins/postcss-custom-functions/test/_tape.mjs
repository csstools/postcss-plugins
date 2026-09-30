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
	classification: {
		message: 'classifies definitions as supported or unsupported',
	},
	typed: {
		message: 'supports typed parameters with defaults',
	},
	'typed:preserve-true': {
		message: 'supports typed parameters with defaults with { preserve: true }',
		options: {
			preserve: true,
		},
	},
	'untyped-defaults': {
		message: 'supports untyped parameters with defaults',
	},
	'untyped-defaults:preserve-true': {
		message: 'supports untyped parameters with defaults with { preserve: true }',
		options: {
			preserve: true,
		},
	},
	locals: {
		message: 'supports initial and inherit in local variables',
	},
	'local-keywords': {
		message: 'resolves other CSS-wide keywords on local variables to the guaranteed-invalid value',
	},
	'inlining': {
		message: 'inlines definitions without conditionals or layers',
	},
	cycles: {
		message: 'handles cyclic functions',
	},
	'conditionals': {
		message: 'supports conditional rules',
	},
	'conditional-definitions': {
		message: 'supports definitions inside conditional rules',
	},
	'conditional-definitions:preserve-true': {
		message: 'supports definitions inside conditional rules with { preserve: true }',
		options: {
			preserve: true,
		},
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
	'unprocessed-call-sites': {
		message: 'keeps definitions that are referenced by unprocessed call sites',
	},
	'conditional-layers': {
		message: 'ignores definitions in conditional layers and orders definitions correctly',
	},
	'anonymous-layers': {
		message: 'keeps anonymous layers distinct',
	},
	'conditional-keyword-result': {
		message: 'leaves functions with non-static keyword results as-is',
	},
	'invalid-bodies': {
		message: 'ignores functions with invalid bodies',
	},
	'style-rule-definition': {
		message: 'ignores functions defined inside a style rule',
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
