/* global testRule */
const { ruleName } = require('./index');

testRule({
	plugins: ['./index.js'],
	ruleName,
	config: true,

	accept: [
		{
			code: '@import "./foo.css";',
			description: 'A basic import',
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
			code: '@import "foo.css?bar=1";',
			description: 'Leading slashes are ambiguous',
			message: 'URL\'s that have query params can not be bundled correctly. Avoid these or add a \'http\' scheme and domain name.',
			line: 1,
			column: 9,
			endLine: 1,
			endColumn: 24,
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
