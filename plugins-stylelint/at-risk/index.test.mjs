import { testRule } from 'stylelint-test-rule-node';
import noAtNestRule from './index.mjs';

const rule = noAtNestRule.rule;

testRule({
	plugins: ['./index.mjs'],
	ruleName: rule.ruleName,
	config: true,

	accept: [
		{
			code: 'div { color: cyan; & { color: purple } }',
			description: 'decl before rule',
		},
		{
			code: 'div { position-area: inherit; }',
		},
	],

	reject: [
		{
			code: 'div { & { color: purple } color: cyan; }',
			description: 'decl after rule',
			message: rule.messages.rejectedNestingDeclOrder(),
			line: 1,
			column: 27,
			endLine: 1,
			endColumn: 32,
		},
		{
			code: 'div { @layer foo; color: cyan; }',
			description: 'decl after rule',
			message: rule.messages.rejectedNestingDeclOrder(),
			line: 1,
			column: 19,
			endLine: 1,
			endColumn: 24,
		},
		{
			code: 'div { @layer foo; /* a comment */ color: cyan; }',
			description: 'decl after rule',
			message: rule.messages.rejectedNestingDeclOrder(),
			line: 1,
			column: 35,
			endLine: 1,
			endColumn: 40,
		},
		{
			code: 'div { inset-area: inherit; }',
			message: rule.messages.rejectedAtRiskPropertyReplacement('inset-area', 'position-area'),
			line: 1,
			column: 7,
			endLine: 1,
			endColumn: 17,
		},
	],
});

testRule({
	plugins: ['./index.mjs'],
	ruleName: rule.ruleName,
	config: null,

	accept: [
		{
			code: 'div { & { color: purple } color: cyan; }',
		},
	],

	reject: [],
});
