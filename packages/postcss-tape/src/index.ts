/* eslint-disable @typescript-eslint/no-var-requires */

import postcss from 'postcss';
import postcssOldestSupported from 'postcss-oldest-supported';
import path from 'path';
import { promises as fsp } from 'fs';
import { strict as assert } from 'assert';

import type { PluginCreator, Plugin } from 'postcss';
import { formatGitHubActionAnnotation } from './github-annotations';
import { dashesSeparator, formatCSSAssertError, formatWarningsAssertError } from './format-asserts';

type TestCaseOptions = {
	message?: string,
	options?: unknown,
	plugins?: Array<Plugin>,
	warnings?: number,

	expect?: string,
	result?: string,

	before?: () => void,
	after?: () => void|Promise<void>,
}

export default function runner(currentPlugin: PluginCreator<unknown>) {
	let hasErrors = false;

	return async (options: Record<string, TestCaseOptions>) => {
		for (const testCaseLabel in options) {
			const testCaseOptions = options[testCaseLabel];

			// Run "before" immediately.
			if (testCaseOptions.before) {
				await testCaseOptions.before();
			}

			const testSourceFilePathWithoutExtension = path.join('.', 'test', testCaseLabel.split(':')[0]);
			const testFilePathWithoutExtension = path.join('.', 'test', testCaseLabel.replace(/:/g, '.'));

			const testFilePath = `${testSourceFilePathWithoutExtension}.css`;
			let expectFilePath = `${testFilePathWithoutExtension}.expect.css`;
			let resultFilePath = `${testFilePathWithoutExtension}.result.css`;

			if (testCaseOptions.expect) {
				expectFilePath = expectFilePath.replace(testCaseLabel.replace(/:/g, '.') + '.expect.css', testCaseOptions.expect);
			}
			if (testCaseOptions.result) {
				resultFilePath = resultFilePath.replace(testCaseLabel.replace(/:/g, '.') + '.result.css', testCaseOptions.result);
			}

			const plugins = testCaseOptions.plugins ?? [currentPlugin(testCaseOptions.options)];

			const input = await fsp.readFile(testFilePath, 'utf8');

			// Check errors on expect file being missing
			let expected: string|false = '';
			try {
				expected = await fsp.readFile(expectFilePath, 'utf8');
			} catch (_) {
				hasErrors = true;
				expected = false;

				if (process.env.GITHUB_ACTIONS) {
					console.log(formatGitHubActionAnnotation(
						`${testCaseLabel}\n\nmissing or broken "expect" file: "${expectFilePath}"`,
						'error',
						{ file: testFilePath, line: 1, col: 1 },
					));
				} else {
					console.error(`\n${testCaseLabel}\n\nmissing or broken "expect" file: "${expectFilePath}"\n\n${dashesSeparator}`);
				}
			}

			const result = await postcss(plugins).process(input, {
				from: testFilePath,
				to: resultFilePath,
				map: {
					inline: false,
					annotation: false,
				},
			});

			const resultString = result.css.toString();
			await fsp.writeFile(resultFilePath, resultString, 'utf8');

			// Can't do further checks if "expect" is missing.
			if (expected === false) {
				continue;
			}

			// Assert result with recent PostCSS.
			{
				try {
					assert.strictEqual(resultString, expected);
				} catch (err) {
					hasErrors = true;

					if (process.env.GITHUB_ACTIONS) {
						console.log(formatGitHubActionAnnotation(
							formatCSSAssertError(testCaseLabel, testCaseOptions, err, true),
							'error',
							{ file: normalizeFilePathForGithubAnnotation(expectFilePath), line: 1, col: 1 },
						));
					} else {
						console.error(formatCSSAssertError(testCaseLabel, testCaseOptions, err));
					}
				}
			}

			// Assert result sourcemaps with recent PostCSS.
			{
				try {
					if (result.map.toJSON().sources.includes('<no source>')) {
						throw new Error('Sourcemap is broken');
					}
				} catch (err) {
					hasErrors = true;

					if (process.env.GITHUB_ACTIONS) {
						console.log(formatGitHubActionAnnotation(
							`${testCaseLabel}\n\nbroken source map: ${JSON.stringify(result.map.toJSON().sources)}`,
							'error',
							{ file: testFilePath, line: 1, col: 1 },
						));
					} else {
						console.error(`\n${testCaseLabel}\n\nbroken source map: ${JSON.stringify(result.map.toJSON().sources)}\n\n${dashesSeparator}`);
					}
				}
			}

			// Run "after" when initial postcss run has completely.
			if (testCaseOptions.after) {
				await testCaseOptions.after();
			}

			// Assert that the result can be passed back to PostCSS and still parses.
			{
				try {
					const secondPassResult = await postcss().process(result, {
						from: resultFilePath,
						to: resultFilePath,
						map: {
							inline: false,
							annotation: false,
						},
					});

					if (secondPassResult.warnings().length) {
						throw new Error('Unexpected warnings on second pass');
					}
				} catch (_) {
					hasErrors = true;

					if (process.env.GITHUB_ACTIONS) {
						console.log(formatGitHubActionAnnotation(
							`${testCaseLabel}\n\nresult was not parse-able with PostCSS.`,
							'error',
							{ file: expectFilePath, line: 1, col: 1 },
						));
					} else {
						console.error(`\n${testCaseLabel}\n\nresult was not parse-able with PostCSS.\n\n${dashesSeparator}`);
					}
				}
			}

			// Assert result with oldest supported PostCSS.
			// Check against the actual result to avoid duplicate warnings.
			{
				const resultFromOldestPostCSS = await postcssOldestSupported(plugins).process(input, {
					from: testFilePath,
					to: resultFilePath,
					map: {
						inline: false,
						annotation: false,
					},
				});

				try {
					assert.strictEqual(resultFromOldestPostCSS.css.toString(), resultString);
				} catch (err) {
					hasErrors = true;

					if (process.env.GITHUB_ACTIONS) {
						console.log(formatGitHubActionAnnotation(
							`${testCaseLabel}\n\nwith older PostCSS:\n\n` + formatCSSAssertError(testCaseLabel, testCaseOptions, err, true),
							'error',
							{ file: normalizeFilePathForGithubAnnotation(expectFilePath), line: 1, col: 1 },
						));
					} else {
						console.error(`\n${testCaseLabel}\n\nwith older PostCSS:\n\n` + formatCSSAssertError(testCaseLabel, testCaseOptions, err));
					}
				}
			}

			// Assert that warnings have the expected amount.
			{
				try {
					if (result.warnings().length || testCaseOptions.warnings) {
						assert.strictEqual(result.warnings().length, testCaseOptions.warnings);
					}
				} catch (err) {
					hasErrors = true;

					if (process.env.GITHUB_ACTIONS) {
						console.log(formatGitHubActionAnnotation(
							formatWarningsAssertError(testCaseLabel, testCaseOptions, result.warnings().length, testCaseOptions.warnings, true),
							'error',
							{ file: normalizeFilePathForGithubAnnotation(expectFilePath), line: 1, col: 1 },
						));
					} else {
						console.error(formatWarningsAssertError(testCaseLabel, testCaseOptions, result.warnings().length, testCaseOptions.warnings));
					}
				}
			}
		}

		if (hasErrors) {
			process.exit(1);
		}
	};
}

function normalizeFilePathForGithubAnnotation(filePath: string) {
	// Any plugin or packages is located in `<workspace>/<package>`;
	const parts = process.cwd().split('/').slice(-2);

	const workspaces = [
		'packages',
		'plugins',
		'plugin-packs',
		'cli',
		'experimental',
	];

	if (!workspaces.includes(parts[0])) {
		throw new Error('PostCSS Tape was intended to be run from <workspace>/package');
	}

	return path.join(parts.join('/'), filePath);
}
