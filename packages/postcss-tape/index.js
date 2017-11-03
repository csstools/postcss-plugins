#!/usr/bin/env node

'use strict';

// tooling
const log  = require('./lib/log');
const fs   = require('fs');
const path = require('path');

// current directory
const cwd = process.cwd();

// argument option matcher
const optionMatch = /^--([\w-]+)=(["']?)(.+?)\2$/;

// options
const opts = Object.assign.apply(
	null,
	[
		// default options
		{
			plugin:   cwd,
			config:   path.join(cwd, '.tape.js'),
			fixtures: path.join(cwd, 'test')
		},
		// package.json[postcssConfig] options
		requireOrThrow(path.join(cwd, 'package.json')).postcssConfig
	].concat(
		// argument options
		process.argv.filter(
			(arg) => optionMatch.test(arg)
		).map(
			(arg) => arg.match(optionMatch)
		).map(
			(arg) => ({
				[arg[1]]: arg[3]
			})
		)
	)
);

// plugin
const plugin = requireOrThrow(path.resolve(cwd, opts.plugin));

// tests
const tests = requireOrThrow(path.resolve(cwd, opts.config));

// runner
Object.keys(tests).reduce(
	(testpromise, section) => testpromise.then(
		() => Object.keys(tests[section]).reduce(
			(sectionpromise, name) => sectionpromise.then(
				(passing) => {
					const test = tests[section][name];

					const testPlugin = typeof test.plugin === 'function' ? test.plugin() : plugin;

					log.wait(section, test.message);

					const testBase = name.split(':')[0];
					const testFull = name.split(':').join('.');
					const warnings = test.warning || 0;

					// test paths
					const sourcePath = path.resolve(opts.fixtures, test.source || `${testBase}.css`);
					const expectPath = path.resolve(opts.fixtures, test.expect || `${testFull}.expect.css`);
					const resultPath = path.resolve(opts.fixtures, test.result || `${testFull}.result.css`);

					if (test.before) {
						test.before();
					}

					return readFile(sourcePath, 'utf8').then(
						(css) => testPlugin.process(
							css,
							Object.assign({
								from: sourcePath,
								to:   resultPath
							}, test.processOptions),
							test.options
						),
						() => writeFile(sourcePath, '').then(
							() => ''
						)
					).then(
						(result) => writeFile(resultPath, result.css).then(
							() => readFile(expectPath, 'utf8').catch(
								() => writeFile(expectPath, '').then(
									() => ''
								)
							)
						).then(
							(css) => {
								if (result.css !== css) {
									return Promise.reject([
										`Expected: ${JSON.stringify(css).slice(1, -1)}`,
										`Rendered: ${JSON.stringify(result.css).slice(1, -1)}`
									])
								} else if (result.warnings().length !== warnings) {
									return Promise.reject([
										`Expected: ${result.warnings().length} warnings`,
										`Rendered: ${warnings} warnings`
									]);
								}

								return passing;
							}
						)
					).then(
						() => {
							if (test.after) {
								test.after();
							}

							log.pass(section, test.message);

							return passing;
						},
						(error) => {
							if (test.after) {
								test.after();
							}

							const expectedError = test.error && Object.keys(test.error).every(
								(key) => test.error[key] instanceof RegExp ? test.error[key].test(error[key]) : test.error[key] === error[key]
							);

							if (expectedError) {
								log.pass(section, test.message);

								return passing;
							}

							log.fail(section, test.message, error.reason || error.message || error);

							return false;
						}
					);
				}
			),
			Promise.resolve(true)
		)
	),
	Promise.resolve(true)
).then(
	(passing) => passing === false ? process.exit(1) : process.exit(0),
	() => process.exit(1)
);

// load modules or throw an error
function requireOrThrow(name) {
	try {
		return require(name);
	} catch (error) {
		log.fail(name, 'failed to load');

		return process.exit(1);
	}
}

// fs.readFile then-ified
function readFile(filename) {
	return new Promise(
		(resolve, reject) => fs.readFile(filename, 'utf8',
			(error, data) => error ? reject(error) : resolve(data)
		)
	);
}

// fs.writeFile then-ified
function writeFile(filename, data) {
	return new Promise(
		(resolve, reject) => fs.writeFile(filename, data,
			(error) => error ? reject(error) : resolve()
		)
	);
}
