'use strict';
import assert from 'assert';
import { parseArguments } from '../dist/args.js';

const argumentParsingCases = [
	{
		message: 'zero values',
		args: [],
		allowedPluginOpts: [],
		expected: {
			stdin: true,
			stdout: true,
			output: null,
			outputDir: null,
			inputs: [],
			inlineMap: true,
			externalMap: false,
			replace: false,
			pluginOptions: {},
			debug: false,
		},
	},
	{
		message: 'with input files at the end (o)',
		args: [
			'-o',
			'"o"',
			'./foo.css',
			'../baz/bar.css',
		],
		allowedPluginOpts: [],
		expected: 'INVALID_ARGUMENTS',
	},
	{
		message: 'with input files at the end (o)',
		args: [
			'--output',
			'foo.css',
			'./foo.css',
		],
		allowedPluginOpts: [],
		expected: 'INVALID_ARGUMENTS',
	},
	{
		message: 'with input files at the end (m)',
		args: [
			'-m',
			'./foo.css',
			'../baz/bar.css',
		],
		allowedPluginOpts: [],
		expected: 'INVALID_ARGUMENTS',
	},
	{
		message: 'with input files at the end (no-map)',
		args: [
			'--no-map',
			'./foo.css',
			'../baz/bar.css',
		],
		allowedPluginOpts: [],
		expected: 'INVALID_ARGUMENTS',
	},
	{
		message: 'with input files at the end (debug)',
		args: [
			'--debug',
			'./foo.css',
			'../baz/bar.css',
		],
		allowedPluginOpts: [],
		expected: 'INVALID_ARGUMENTS',
	},
	{
		message: 'with input files at the end (r)',
		args: [
			'-r',
			'./foo.css',
			'../baz/bar.css',
		],
		allowedPluginOpts: [],
		expected: 'INVALID_ARGUMENTS',
	},
	{
		message: 'with input files at the end (d)',
		args: [
			'-d',
			'"d"',
			'./foo.css',
			'../baz/bar.css',
		],
		allowedPluginOpts: [],
		expected: 'INVALID_ARGUMENTS',
	},
	{
		message: 'with input files at the end (p)',
		args: [
			'-p',
			'{ "an_option": true }',
			'./foo.css',
			'../baz/bar.css',
		],
		allowedPluginOpts: ['an_option'],
		expected: 'INVALID_ARGUMENTS',
	},
	{
		message: 'with input files in the middle',
		args: [
			'-d',
			'"d"',
			'./foo.css',
			'../baz/bar.css',
			'-m',
		],
		allowedPluginOpts: [],
		expected: 'INVALID_ARGUMENTS',
	},
	{
		message: 'all arguments',
		args: [
			'./foo.css',
			'../baz/bar.css',
			'-d',
			'"d"',
			'--dir',
			'\'dir\'',
			'-m',
			'--no-map',
			'--replace',
			'',
			'-p',
			'{ "an_option": true }',
			'--plugin-options',
			'{ "an_option": false }',
			'--debug',
		],
		allowedPluginOpts: [
			'an_option',
		],
		expected: {
			stdin: false,
			stdout: false,
			output: null,
			outputDir: null,
			inputs: [ './foo.css', '../baz/bar.css' ],
			inlineMap: false,
			externalMap: false,
			replace: true,
			pluginOptions: { an_option: false },
			debug: true,
		},
	},
	{
		message: 'stdout',
		args: ['./foo.css'],
		allowedPluginOpts: [],
		expected: {
			stdin: false,
			stdout: true,
			output: null,
			outputDir: null,
			inputs: ['./foo.css'],
			inlineMap: true,
			externalMap: false,
			replace: false,
			pluginOptions: {},
			debug: false,
		},
	},
	{
		message: 'an option',
		args: ['./foo.css', '-p', '{ "an_option": true }'],
		allowedPluginOpts: ['an_option'],
		expected: {
			stdin: false,
			stdout: true,
			output: null,
			outputDir: null,
			inputs: [ './foo.css' ],
			inlineMap: true,
			externalMap: false,
			replace: false,
			pluginOptions: { an_option: true },
			debug: false,
		},
	},
	{
		message: 'an unknown option',
		args: ['./foo.css', '-p', '{ "an_option": true }'],
		allowedPluginOpts: [],
		expected: 'INVALID_ARGUMENTS',
	},
	{
		message: 'an unknown argument',
		args: ['./foo.css', '-x', 'y'],
		allowedPluginOpts: [],
		expected: 'INVALID_ARGUMENTS',
	},
	{
		message: 'invalid json',
		args: ['./foo.css', '-p', '{ an_option: true }'],
		allowedPluginOpts: [],
		expected: 'INVALID_ARGUMENTS',
	},
	{
		message: 'multiple inputs with --output option',
		args: ['./foo.css', './fooz.css', '-o', './baz.css'],
		allowedPluginOpts: [],
		expected: 'INVALID_ARGUMENTS',
	},
	{
		message: 'multiple inputs with --dir option, but also with --output',
		args: ['./foo.css', './fooz.css', '-o', './baz.css', '-d', './baz/'],
		allowedPluginOpts: [],
		expected: {
			stdin: false,
			stdout: false,
			output: null,
			outputDir: './baz/',
			inputs: [ './foo.css', './fooz.css' ],
			inlineMap: true,
			externalMap: false,
			replace: false,
			pluginOptions: {},
			debug: false,
		},
	},
	{
		message: 'output and output dir',
		args: ['-o', './baz.css', '-d', './baz/'],
		allowedPluginOpts: [],
		expected: {
			stdin: true,
			stdout: false,
			output: null,
			outputDir: './baz/',
			inputs: [],
			inlineMap: true,
			externalMap: false,
			replace: false,
			pluginOptions: {},
			debug: false,
		},
	},
	{
		message: 'replace with multiple inputs',
		args: ['./foo.css', './fooz.css', '-r'],
		allowedPluginOpts: [],
		expected: {
			stdin: false,
			stdout: false,
			output: null,
			outputDir: null,
			inputs: [ './foo.css', './fooz.css' ],
			inlineMap: true,
			externalMap: false,
			replace: true,
			pluginOptions: {},
			debug: false,
		},
	},
	{
		message: 'short flag o',
		args: ['./foo.css', '-o', 'foo'],
		allowedPluginOpts: [],
		expected: {
			stdin: false,
			stdout: false,
			output: 'foo',
			outputDir: null,
			inputs: [ './foo.css' ],
			inlineMap: true,
			externalMap: false,
			replace: false,
			pluginOptions: {},
			debug: false,
		},
	},
	{
		message: 'long flag o',
		args: ['./foo.css', '--output', 'foo'],
		allowedPluginOpts: [],
		expected: {
			stdin: false,
			stdout: false,
			output: 'foo',
			outputDir: null,
			inputs: [ './foo.css' ],
			inlineMap: true,
			externalMap: false,
			replace: false,
			pluginOptions: {},
			debug: false,
		},
	},
	{
		message: 'short flag m',
		args: ['./foo.css', '-m'],
		allowedPluginOpts: [],
		expected: {
			stdin: false,
			stdout: true,
			output: null,
			outputDir: null,
			inputs: [ './foo.css' ],
			inlineMap: false,
			externalMap: false,
			replace: false,
			pluginOptions: {},
			debug: false,
		},
	},
	{
		message: 'short flag m with output',
		args: ['./foo.css', '-m', '-o', './output.css'],
		allowedPluginOpts: [],
		expected: {
			stdin: false,
			stdout: false,
			output: './output.css',
			outputDir: null,
			inputs: [ './foo.css' ],
			inlineMap: false,
			externalMap: true,
			replace: false,
			pluginOptions: {},
			debug: false,
		},
	},
	{
		message: 'long flag map',
		args: ['./foo.css', '--map'],
		allowedPluginOpts: [],
		expected: {
			stdin: false,
			stdout: true,
			output: null,
			outputDir: null,
			inputs: [ './foo.css' ],
			inlineMap: false,
			externalMap: false,
			replace: false,
			pluginOptions: {},
			debug: false,
		},
	},
	{
		message: 'long flag map with output',
		args: ['./foo.css', '--map', '-o', './output.css'],
		allowedPluginOpts: [],
		expected: {
			stdin: false,
			stdout: false,
			output: './output.css',
			outputDir: null,
			inputs: [ './foo.css' ],
			inlineMap: false,
			externalMap: true,
			replace: false,
			pluginOptions: {},
			debug: false,
		},
	},
	{
		message: 'short flag m with invalid trailer',
		args: ['./foo.css', '-m', 'foo'],
		allowedPluginOpts: [],
		expected: 'INVALID_ARGUMENTS',
	},
	{
		message: 'long flag map with invalid trailer',
		args: ['./foo.css', '--map', 'foo'],
		allowedPluginOpts: [],
		expected: 'INVALID_ARGUMENTS',
	},
	{
		message: 'long flag map with valid trailer',
		args: ['./foo.css', '--map', '--replace', '--dir', './baz/'],
		allowedPluginOpts: [],
		expected: {
			stdin: false,
			stdout: false,
			output: null,
			outputDir: null,
			inputs: [ './foo.css' ],
			inlineMap: false,
			externalMap: true,
			replace: true,
			pluginOptions: {},
			debug: false,
		},
	},
	{
		message: 'debug',
		args: ['./foo.css', '--debug'],
		allowedPluginOpts: [],
		expected: {
			stdin: false,
			stdout: true,
			output: null,
			outputDir: null,
			inputs: [ './foo.css' ],
			inlineMap: true,
			externalMap: false,
			replace: false,
			pluginOptions: {},
			debug: true,
		},
	},
];

argumentParsingCases.forEach((testCase) => {
	const result = parseArguments(testCase.args, testCase.allowedPluginOpts, () => { });
	assert.strict.deepEqual(result, testCase.expected, testCase.message);
});
