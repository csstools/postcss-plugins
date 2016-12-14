#!/usr/bin/env node

// tooling
const fs   = require('fs');
const path = require('path');

// current directory
const cwd = process.cwd();

// error symbols
const pass = '\x1b[32m\✔\x1b[0m';
const fail = '\x1b[31m\✖\x1b[0m';

// argument option matcher
const optionMatch = /^--([\w-]+)=(["']?)(.+?)\2$/;

// options
const opts = Object.assign(
	// default options
	{
		plugin:   cwd,
		config:   path.join(cwd, '.tape.js'),
		fixtures: path.join(cwd, 'test')
	},
	// package.json[postcssConfig] options
	requireOrThrow(path.join(cwd, 'package.json')).postcssConfig,
	// argument options
	...process.argv.filter(
		(arg) => optionMatch.test(arg)
	).map(
		(arg) => arg.match(optionMatch)
	).map(
		(arg) => ({
			[arg[1]]: arg[3]
		})
	)
);

// plugin
const plugin = requireOrThrow(path.resolve(cwd, opts.plugin));

// tests
const tests = requireOrThrow(path.resolve(cwd, opts.config));

// runner
Promise.all(Object.keys(tests).map(
	(section) => Promise.all(
		Object.keys(tests[section]).map(
			(name) => {
				// test options
				const test = tests[section][name];

				const baseName = name.split(':')[0];
				const testName = name.split(':').join('.');
				const warnings = test.warning || 0;

				// test paths
				const sourcePath = path.resolve(opts.fixtures, baseName + '.css');
				const expectPath = path.resolve(opts.fixtures, testName + '.expect.css');
				const resultPath = path.resolve(opts.fixtures, testName + '.result.css');

				// promise source css and expected css contents
				return Promise.all([
					readFile(sourcePath, 'utf8'),
					readFile(expectPath, 'utf8')
				]).then(
					([sourceCSS, expectCSS]) => plugin.process.apply(
						null,
						plugin.process.length === 3 ? [
							sourceCSS,
							test.options,
							{
								from: sourcePath,
								to:   resultPath
							}
						] : [
							sourceCSS,
							Object.assign(
								{
									from: sourcePath,
									to:   resultPath
								},
								test.options
							)
						]
					).then(
						(result) => writeFile(resultPath, result.css).then(
							() => {
								if (result.css !== expectCSS) {
									throw new Error(`  ${ fail }  ${ test.message }\n${ JSON.stringify({
										expect: expectCSS,
										result: result.css
									}, null, '  ') }`);
								} else if (result.warnings().length !== warnings) {
									throw Error(`  ${ fail } ${ test.message } (${ result.warnings().length } warnings, expected ${ warnings })`);
								} else {
									return `  ${ pass }  ${ test.message }`;
								}
							}
						),
						(error) => {
							const expectedError = test.error && Object.keys(test.error).every(
								(key) => test.error[key] instanceof RegExp ? test.error[key].test(error[key]) : test.error[key] === error[key]
							);

							if (expectedError) {
								return `  ${ pass }  ${ test.message }`;
							} else {
								if (test.after) {
									test.after();
								}

								throw error;
							}
						}
					)
				).then(
					(result) => {
						if (test.after) {
							test.after();
						}

						return result;
					}
				);
			}
		)
	).then(
		(messages) => console.log(`${ pass } ${ section }\n${ messages.join('\n') }\n`),
		(error) => {
			console.log(`${ fail } ${ section }\n${ error }\n`);

			throw error;
		}
	)
)).then(
	() => console.log(`\n${ pass } Test passed\n`) && process.exit(0),
	() => console.log(`\n${ fail } Test failed\n`) && process.exit(1)
);

// Promise fs.readFile
function readFile(filename) {
	return new Promise(
		(resolve, reject) => fs.readFile(filename, 'utf8',
			(error, data) => error ? reject(error) : resolve(data)
		)
	);
}

// Promise fs.writeFile
function writeFile(filename, data) {
	return new Promise(
		(resolve, reject) => fs.writeFile(filename, data,
			(error) => error ? reject(error) : resolve()
		)
	);
}

// load modules or throw an error
function requireOrThrow(name) {
	try {
		return require(name);
	} catch (error) {
		console.log(`${ fail } Failed to load "${ name }"\n`);

		return process.exit(1);
	}
}
