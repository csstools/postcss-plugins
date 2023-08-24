/* global testRule */
const { ruleName } = require('./index');

testRule({
	plugins: ['./index.js'],
	ruleName,
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
	],

	reject: [
		{
			code: '@import "/foo.css";',
			description: 'Leading slashes are ambiguous',
			message: 'URL\'s that start with a slash are ambiguous when bundling, use a relative URL instead.',
			line: 1,
			column: 9,
			endLine: 1,
			endColumn: 19,
		},
		{
			code: '@import "#foo.css";',
			description: 'Leading number signs are invalid',
			message: 'URL\'s that start with a number sign (#) are invalid when bundling.',
			line: 1,
			column: 9,
			endLine: 1,
			endColumn: 19,
		},
		{
			code: '@import "foo.css?bar=1";',
			description: 'Query params can not be processed by a bundler',
			message: 'URL\'s that have query params can not be bundled correctly. Avoid these or add a \'http(s)\' scheme and domain name.',
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
			message: 'Imports for remote resources after a local import will not be bundled correctly. Move these to the top of the file.',
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
			message: 'Imports for remote resources after a local import will not be bundled correctly. Move these to the top of the file.',
			line: 3,
			column: 13,
			endLine: 3,
			endColumn: 36,
		},
	],
});

testRule({
	plugins: ['./index.js'],
	ruleName,
	config: false,

	accept: [
		{
			code: '@import "/foo.css";',
			description: 'An invalid import',
		},
	],

	reject: [],
});
