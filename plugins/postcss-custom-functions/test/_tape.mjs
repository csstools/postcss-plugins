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
	property: {
		message: 'supports @property rules for local variables',
	},
	'property:preserve-true': {
		message: 'supports @property rules for local variables with { preserve: true }',
		options: {
			preserve: true,
		},
	},
	'local-keywords': {
		message: 'resolves other CSS-wide keywords on local variables to the guaranteed-invalid value',
	},
	'local-if': {
		message: 'substitutes local variables in if() conditions',
	},
	'local-inherit': {
		message: 'substitutes inherit() from the calling scope',
	},
	'parameter-keywords': {
		message: 'resolves CSS-wide keywords in function arguments',
	},
	'inlining': {
		message: 'inlines definitions without conditionals or layers',
	},
	cycles: {
		message: 'handles cyclic functions',
	},
	'conditional-cycles': {
		message: 'does not evaluate cycles in inactive or losing declarations',
	},
	'conditionals': {
		message: 'supports conditional rules',
	},
	'conditional-definitions': {
		message: 'supports definitions inside conditional rules',
	},
	'conditional-locals': {
		message: 'supports conditional local declarations and registrations',
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
	'arguments': {
		message: 'supports empty arguments, trailing commas and whitespace trimming',
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
	'group-keyword-result': {
		message: 'leaves a name with keyword results in several definitions as-is',
	},
	'invalid-bodies': {
		message: 'ignores functions with invalid bodies',
	},
	'important': {
		message: 'ignores !important declarations in function bodies',
	},
	'empty-body': {
		message: 'supports empty function bodies',
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
