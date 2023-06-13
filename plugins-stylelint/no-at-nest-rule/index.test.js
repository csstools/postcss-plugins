/* global testRule */
const { rule, ruleName } = require('./index');

testRule({
	plugins: ['./index.js'],
	ruleName,
	config: true,

	accept: [
		{
			code: 'div {}',
			description: 'Un-nested selector',
		},
		{
			code: 'div { @media print { color: green; } }',
			description: 'Nested conditional media rule',
		},
		{
			code: '@media print { div { color: green; } }',
			description: 'Regular conditional media rule',
		},
	],

	reject: [
		{
			code: 'div { @nest bar { color: red } }',
			description: '@nest rule before tag name',
			message: rule.messages.rejected(),
			line: 1,
			column: 7,
			endLine: 1,
			endColumn: 12,
		},
		{
			code: 'div { @Nest bar { color: red } }',
			description: '@nest uppercase',
			message: rule.messages.rejected(),
			line: 1,
			column: 7,
			endLine: 1,
			endColumn: 12,
		},
		{
			code: 'div { @nest bar { color: red } @nest foo { color: green } }',
			description: '@nest rule before tag name',
			warnings: [
				{
					message: rule.messages.rejected(),
					line: 1,
					column: 7,
					endLine: 1,
					endColumn: 12,
				},
				{
					message: rule.messages.rejected(),
					line: 1,
					column: 32,
					endLine: 1,
					endColumn: 37,
				},
			],
		},
	],
});

testRule({
	plugins: ['./index.js'],
	ruleName,
	config: true,
	fix: true,

	accept: [],

	reject: [
		{
			code: 'div { @nest bar { color: red } }',
			fixed: 'div { bar { color: red } }',
			description: '@nest rule before tag name',
			message: rule.messages.rejected(),
			line: 1,
			column: 7,
			endLine: 1,
			endColumn: 12,
		},
		{
			code: 'div { @nest bar { color: red } @nest foo { color: green } }',
			fixed: 'div { bar { color: red } foo { color: green } }',
			description: '@nest rule before tag name',
			warnings: [
				{
					message: rule.messages.rejected(),
					line: 1,
					column: 7,
					endLine: 1,
					endColumn: 12,
				},
				{
					message: rule.messages.rejected(),
					line: 1,
					column: 32,
					endLine: 1,
					endColumn: 37,
				},
			],
		},
	],
});

testRule({
	plugins: ['./index.js'],
	ruleName,
	config: false,

	accept: [
		{
			code: 'div { @nest bar { color: red } }',
		},
	],

	reject: [],
});
