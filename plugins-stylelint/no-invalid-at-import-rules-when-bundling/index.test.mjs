import { testRule } from 'stylelint-test-rule-node';
import noAtNestRule from './index.mjs';

const rule = noAtNestRule.rule;

testRule({
	plugins: ['./index.mjs'],
	ruleName: rule.ruleName,
	config: true,

	accept: [
		{
			code: '@import "./foo.css";',
		},
		{
			code: '@import "foo.css";',
		},
		{
			code: '@import "https://example.com/foo.css";',
		},
		{
			code: '@import "http://example.com/foo.css";',
		},
		{
			code: '@import "//example.com/foo.css";',
		},
		{
			code: '@import "http://example.com/foo.css"; @import "http://example.com/bar.css";',
		},
		{
			code: '@import "foo.css"; @import "node_modules:bar.css";',
		},
		{
			code: '@layer foo; @import "foo.css";',
		},
	],

	reject: [
		{
			code: '@import "/foo.css";',
			description: 'Leading slashes are ambiguous',
			message: 'URL\'s that start with a slash are ambiguous when bundling, use a relative URL instead. (@csstools/stylelint-no-invalid-at-import-rules-when-bundling)',
			line: 1,
			column: 9,
			endLine: 1,
			endColumn: 19,
		},
		{
			code: '@import "#foo.css";',
			description: 'Leading number signs are invalid',
			message: 'URL\'s that start with a number sign (#) are invalid when bundling. (@csstools/stylelint-no-invalid-at-import-rules-when-bundling)',
			line: 1,
			column: 9,
			endLine: 1,
			endColumn: 19,
		},
		{
			code: '@import "foo.css?bar=1";',
			description: 'Query params can not be processed by a bundler',
			message: 'URL\'s that have query params can not be bundled correctly. Avoid these or add a \'http(s)\' scheme and domain name. (@csstools/stylelint-no-invalid-at-import-rules-when-bundling)',
			line: 1,
			column: 9,
			endLine: 1,
			endColumn: 24,
		},
		{
			code: `
				@import "foo.css";
				@import "https://example.com/bar.css";
			`,
			description: 'Remote resources after a local import will not be bundled correctly',
			message: '`@import` statements for remote resources after a local import will not be bundled correctly. Move these to the top of the file. (@csstools/stylelint-no-invalid-at-import-rules-when-bundling)',
			line: 3,
			column: 13,
			endLine: 3,
			endColumn: 42,
		},
		{
			code: `
				@import "foo.css";
				@import "//example.com/bar.css";
			`,
			description: 'Remote resources after a local import will not be bundled correctly',
			message: '`@import` statements for remote resources after a local import will not be bundled correctly. Move these to the top of the file. (@csstools/stylelint-no-invalid-at-import-rules-when-bundling)',
			line: 3,
			column: 13,
			endLine: 3,
			endColumn: 36,
		},
		{
			code: '@import "fOO.css";',
			description: 'Case sensitivity',
			message: 'URL\'s with uppercase characters might give conflicts between users on case sensitive or insensitive file systems. Use lower case characters only to avoid potential issues. (@csstools/stylelint-no-invalid-at-import-rules-when-bundling)',
			line: 1,
			column: 9,
			endLine: 1,
			endColumn: 18,
		},
		{
			code: '@import "foo.css" { color: green; }',
			description: 'Child nodes are not allowed',
			message: '`@import` statements must not have any child nodes. (@csstools/stylelint-no-invalid-at-import-rules-when-bundling)',
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 35,
		},
		{
			code: '@import "foo.css" {}',
			description: 'Child nodes are not allowed',
			message: '`@import` statements must not have any child nodes. (@csstools/stylelint-no-invalid-at-import-rules-when-bundling)',
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 20,
		},
		{
			code: '@layer foo {} @import "foo.css";',
			description: 'Order',
			message: '`@import` statements must be precede all other nodes except for `@charset` or `@layer` and all `@import` statements must be consecutive. (@csstools/stylelint-no-invalid-at-import-rules-when-bundling)',
			line: 1,
			column: 15,
			endLine: 1,
			endColumn: 31,
		},
		{
			code: '@import "foo.css"; .bar {} @import "bar.css";',
			description: 'Order',
			message: '`@import` statements must be precede all other nodes except for `@charset` or `@layer` and all `@import` statements must be consecutive. (@csstools/stylelint-no-invalid-at-import-rules-when-bundling)',
			line: 1,
			column: 28,
			endLine: 1,
			endColumn: 44,
		},
	],
});

testRule({
	plugins: ['./index.mjs'],
	ruleName: rule.ruleName,
	config: false,

	accept: [
		{
			code: '@import "/foo.css";',
			description: 'An invalid import',
		},
	],

	reject: [],
});
