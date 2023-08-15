import fs from 'fs';
import noopPlugin from './noop-plugin';
import path from 'path';
import postcss from 'postcss';
import postcssOldestSupported, { AcceptedPlugin } from 'postcss-8.4';
import syntaxHTML from 'postcss-html';
import type { AtRule, Declaration, Rule } from 'postcss';
import type { PluginCreator, Plugin, Result } from 'postcss';
import type { TestCaseOptions } from './test-case-options';
import { dashesSeparator, formatCSSAssertError, formatWarningsAssertError } from './format-asserts';
import { formatGitHubActionAnnotation } from './github-annotations';
import { reduceInformationInCssSyntaxError } from './reduce-css-syntax-error';
import { strict as assert } from 'assert';

const emitGitHubAnnotations = process.env.GITHUB_ACTIONS && process.env.ENABLE_ANNOTATIONS_FOR_NODE === 'true' && process.env.ENABLE_ANNOTATIONS_FOR_OS === 'true';

function postcssSyntax(options: TestCaseOptions) {
	if (options.postcssSyntaxHTML) {
		return syntaxHTML();
	}

	return undefined;
}

function postcssSyntaxSupportsSourceMaps(options: TestCaseOptions) {
	if (options.postcssSyntaxHTML) {
		return false;
	}

	return true;
}

export function postcssTape(currentPlugin: PluginCreator<unknown>) {
	let hasErrors = false;

	// Plugin conforms to https://github.com/postcss/postcss/blob/main/docs/guidelines/plugin.md
	{
		if (currentPlugin.postcss !== true) {
			hasErrors = true;

			if (emitGitHubAnnotations) {
				console.log(formatGitHubActionAnnotation(
					'postcss flag not set to "true" on exported plugin object',
					'error',
					{ file: './package.json', line: 1, col: 1 }, /* attributed to package.json because we don't know the source file of "currentPlugin" */
				));
			} else {
				console.error(`\npostcss flag not set to "true"\n\n${dashesSeparator}`);
			}
		}

		// https://github.com/postcss/postcss/blob/main/docs/guidelines/plugin.md#15-set-pluginpostcssplugin-with-plugin-name
		// Set plugin.postcssPlugin with plugin name
		const plugin = currentPlugin() as Plugin;
		if (!plugin.postcssPlugin || typeof plugin.postcssPlugin !== 'string') {
			hasErrors = true;

			if (emitGitHubAnnotations) {
				console.log(formatGitHubActionAnnotation(
					'plugin name not set via "postcssPlugin"',
					'error',
					{ file: './package.json', line: 1, col: 1 }, /* attributed to package.json because we don't know the source file of "currentPlugin" */
				));
			} else {
				console.error(`\nplugin name not set via "postcssPlugin"\n\n${dashesSeparator}`);
			}
		}

		// https://github.com/postcss/postcss/blob/main/docs/guidelines/plugin.md#54-include-postcss-plugin-keyword-in-packagejson
		// Include postcss-plugin keyword in package.json
		const packageInfo = JSON.parse(fs.readFileSync('./package.json', 'utf-8').toString());
		if (!packageInfo.keywords || !packageInfo.keywords.includes('postcss-plugin')) {
			hasErrors = true;

			if (emitGitHubAnnotations) {
				console.log(formatGitHubActionAnnotation(
					'package.json does not include "postcss-plugin" keyword',
					'error',
					{ file: './package.json', line: 1, col: 1 }, /* attributed to package.json because we don't know the source file of "currentPlugin" */
				));
			} else {
				console.error(`\npackage.json does not include "postcss-plugin" keyword\n\n${dashesSeparator}`);
			}
		}

		// https://github.com/postcss/postcss/blob/main/docs/guidelines/plugin.md#11-clear-name-with-postcss--prefix
		// Clear name with postcss- prefix
		const isOlderPackageName = [
			'css-has-pseudo',
			'css-blank-pseudo',
			'css-prefers-color-scheme',
			'@csstools/css-has-pseudo-experimental',
		].includes(packageInfo.name);

		let packageName = packageInfo.name;
		if (packageName.startsWith('@')) {
			const parts = packageInfo.name.split('/');
			packageName = parts.slice(1).join('/');
		}

		if (!packageName.startsWith('postcss-') && !isOlderPackageName) {
			hasErrors = true;

			if (emitGitHubAnnotations) {
				console.log(formatGitHubActionAnnotation(
					'plugin name in package.json does not start with "postcss-"',
					'error',
					{ file: './package.json', line: 1, col: 1 },
				));
			} else {
				console.error(`\nplugin name in package.json does not start with "postcss-"\n\n${dashesSeparator}`);
			}
		}

		// https://github.com/postcss/postcss/blob/main/docs/guidelines/plugin.md#14-keep-postcss-to-peerdependencies
		// Keep postcss to peerDependencies
		if (Object.keys(Object(packageInfo.dependencies)).includes('postcss') && !('postcssTapeSelfTest' in currentPlugin)) {
			hasErrors = true;

			if (emitGitHubAnnotations) {
				console.log(formatGitHubActionAnnotation(
					'postcss should only be a peer and/or dev dependency',
					'error',
					{ file: './package.json', line: 1, col: 1 },
				));
			} else {
				console.error(`\npostcss should only be a peer and/or dev dependency\n\n${dashesSeparator}`);
			}
		}
	}

	// Test cases
	return async (options: Record<string, TestCaseOptions>) => {
		const failureSummary = new Set();

		for (const testCaseLabel in options) {
			const testCaseOptions = options[testCaseLabel];

			// Run "before" immediately.
			if (testCaseOptions.before) {
				await testCaseOptions.before();
			}

			const testSourceFilePathWithoutExtension = path.join('.', 'test', testCaseLabel.split(':')[0]);
			const testFilePathWithoutExtension = path.join('.', 'test', testCaseLabel.replace(/:/g, '.'));

			let extension = 'css';
			if (testCaseOptions.postcssSyntaxHTML) {
				extension = 'html';
			}

			const testFilePath = `${testSourceFilePathWithoutExtension}.${extension}`;
			let expectFilePath = `${testFilePathWithoutExtension}.expect.${extension}`;
			let resultFilePath = `${testFilePathWithoutExtension}.result.${extension}`;

			if (testCaseOptions.expect) {
				expectFilePath = path.join('.', 'test', testCaseOptions.expect);
			}
			if (testCaseOptions.result) {
				resultFilePath = path.join('.', 'test', testCaseOptions.result);
			}

			const plugins = testCaseOptions.plugins ?? [currentPlugin(testCaseOptions.options)];

			const input = fs.readFileSync(testFilePath, 'utf8');

			// Check errors on expect file being missing
			let expected: string | false = '';
			try {
				expected = fs.readFileSync(expectFilePath, 'utf8');
			} catch (_) {
				hasErrors = true;
				expected = false;

				if (emitGitHubAnnotations) {
					console.log(formatGitHubActionAnnotation(
						`${testCaseLabel}\n\nmissing or broken "expect" file: "${path.parse(expectFilePath).base}"`,
						'error',
						{ file: testFilePath, line: 1, col: 1 },
					));
				} else {
					failureSummary.add(testCaseLabel);
					console.error(`\n${testCaseLabel}\n\nmissing or broken "expect" file: "${path.parse(expectFilePath).base}"\n\n${dashesSeparator}`);
				}
			}

			let result: Result;

			let sawException = false;
			try {
				result = await postcss(plugins).process(input, {
					from: testFilePath,
					to: resultFilePath,
					map: postcssSyntaxSupportsSourceMaps(testCaseOptions) ? {
						inline: false,
						annotation: false,
					} : false,
					syntax: postcssSyntax(testCaseOptions),
				});
			} catch (err) {
				reduceInformationInCssSyntaxError(err);
				sawException = true;
				if (testCaseOptions.exception && testCaseOptions.exception.test(err.message)) {
					// expected an exception and got one.
					continue;
				}

				// rethrow
				throw err;
			}

			if (!sawException && testCaseOptions.exception) {
				hasErrors = true;

				if (emitGitHubAnnotations) {
					console.log(formatGitHubActionAnnotation(
						`${testCaseLabel}\n\nexpected an exception but got none`,
						'error',
						{ file: testFilePath, line: 1, col: 1 },
					));
				} else {
					failureSummary.add(testCaseLabel);
					console.error(`\n${testCaseLabel}\n\nexpected an exception but got none\n\n${dashesSeparator}`);
				}
			}

			// Try to write the result file, even if further checks fails.
			// This helps writing new tests for plugins.
			// Taking the result file as a starting point for the expect file.
			const resultString = result.css.toString();
			fs.writeFileSync(resultFilePath, resultString, 'utf8');

			// Allow contributors to rewrite `.expect.css` files through postcss-tape.
			if (process.env.REWRITE_EXPECTS) {
				fs.writeFileSync(expectFilePath, resultString, 'utf8');
			}

			// Can't do further checks if "expect" is missing.
			if (expected === false) {
				continue;
			}

			// Assert result with recent PostCSS.
			//
			// NOTE:
			// The version we declare as a peer dependency in plugins.
			{
				try {
					assert.strictEqual(resultString, expected);
				} catch (err) {
					hasErrors = true;

					if (emitGitHubAnnotations) {
						console.log(formatGitHubActionAnnotation(
							formatCSSAssertError(testCaseLabel, testCaseOptions, err, true),
							'error',
							{ file: expectFilePath, line: 1, col: 1 },
						));
					} else {
						failureSummary.add(testCaseLabel);
						console.error(formatCSSAssertError(testCaseLabel, testCaseOptions, err));
					}
				}
			}

			// Assert result sourcemaps with recent PostCSS.
			{
				try {
					if (
						!testCaseOptions.postcssSyntaxHTML &&
						result.map.toJSON().sources.includes('<no source>')
					) {
						throw new Error('Sourcemap is broken');
					}
				} catch (_) {
					hasErrors = true;

					const helpText = '\nThis is most likely a newly created PostCSS AST Node without a value for "source".\nsee :\n- https://github.com/postcss/postcss/blob/main/docs/guidelines/plugin.md#24-set-nodesource-for-new-nodes\n- https://postcss.org/api/#node-source';
					if (emitGitHubAnnotations) {
						console.log(formatGitHubActionAnnotation(
							`${testCaseLabel}\n\nbroken source map: ${JSON.stringify(result.map.toJSON().sources)}\n${helpText}`,
							'error',
							{ file: testFilePath, line: 1, col: 1 },
						));
					} else {
						failureSummary.add(testCaseLabel);
						console.error(`\n${testCaseLabel}\n\nbroken source map: ${JSON.stringify(result.map.toJSON().sources)}\n${helpText}\n\n${dashesSeparator}`);
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
					const resultContents = fs.readFileSync(resultFilePath, 'utf8');
					const secondPassResult = await postcss([noopPlugin()]).process(resultContents, {
						from: resultFilePath,
						to: resultFilePath,
						map: postcssSyntaxSupportsSourceMaps(testCaseOptions) ? {
							inline: false,
							annotation: false,
						} : false,
						syntax: postcssSyntax(testCaseOptions),
					});

					if (secondPassResult.warnings().length) {
						throw new Error('Unexpected warnings on second pass');
					}
				} catch (_) {
					hasErrors = true;

					if (emitGitHubAnnotations) {
						console.log(formatGitHubActionAnnotation(
							`${testCaseLabel}\n\nresult was not parsable with PostCSS.`,
							'error',
							{ file: expectFilePath, line: 1, col: 1 },
						));
					} else {
						failureSummary.add(testCaseLabel);
						console.error(`\n${testCaseLabel}\n\nresult was not parsable with PostCSS.\n\n${dashesSeparator}`);
					}
				}
			}

			// Assert result with oldest supported PostCSS.
			// Check against the actual result to avoid duplicate warnings.
			//
			// NOTE:
			// The oldest version of PostCSS we support at this time.
			// This does not need to be a different version than the latest version of PostCSS.
			// There is no system behind setting this.
			// It is here to allow testing a specific older version, if parts of the community can't update yet.
			if (postcss([noopPlugin()]).version !== postcssOldestSupported([noopPlugin()]).version) { // https://postcss.org/api/#processor-version
				const resultFromOldestPostCSS = await postcssOldestSupported(plugins as Array<AcceptedPlugin>).process(input, {
					from: testFilePath,
					to: resultFilePath,
					map: postcssSyntaxSupportsSourceMaps(testCaseOptions) ? {
						inline: false,
						annotation: false,
					} : false,
				});

				try {
					assert.strictEqual(resultFromOldestPostCSS.css.toString(), resultString);
				} catch (err) {
					reduceInformationInCssSyntaxError(err);
					hasErrors = true;

					if (emitGitHubAnnotations) {
						console.log(formatGitHubActionAnnotation(
							'testing older PostCSS:\n' + formatCSSAssertError(testCaseLabel, testCaseOptions, err, true),
							'error',
							{ file: expectFilePath, line: 1, col: 1 },
						));
					} else {
						failureSummary.add(testCaseLabel);
						console.error('testing older PostCSS:\n' + formatCSSAssertError(testCaseLabel, testCaseOptions, err));
					}
				}
			}

			// Assert that warnings have the expected amount.
			{
				try {
					if (result.warnings().length || testCaseOptions.warnings) {
						assert.strictEqual(result.warnings().length, testCaseOptions.warnings);
					}
				} catch (_) {
					hasErrors = true;

					if (emitGitHubAnnotations) {
						console.log(formatGitHubActionAnnotation(
							formatWarningsAssertError(testCaseLabel, testCaseOptions, result.warnings(), testCaseOptions.warnings ?? 0, true),
							'error',
							{ file: expectFilePath, line: 1, col: 1 },
						));
					} else {
						failureSummary.add(testCaseLabel);
						console.error(formatWarningsAssertError(testCaseLabel, testCaseOptions, result.warnings(), testCaseOptions.warnings ?? 0));
					}
				}
			}
		}

		if (failureSummary.size) {
			console.error('\nunexpected failures:');
			for (const label of failureSummary.values()) {
				console.error('  - ' + label);
			}
		}

		if (hasErrors) {
			process.exit(1);
		}

		console.warn('pass ' + (currentPlugin() as Plugin).postcssPlugin);
	};
}

export const declarationClonerPlugin = {
	postcssPlugin: 'declaration-cloner',
	Declaration(decl: Declaration) {
		if (decl.prop === 'to-clone') {
			decl.cloneBefore({ prop: 'cloned' });
		}
	},
};

export const ruleClonerPlugin = {
	postcssPlugin: 'rule-cloner',
	prepare() {
		const transformedNodes = new WeakSet();

		return {
			RuleExit(rule: Rule) {
				if (transformedNodes.has(rule)) {
					return;
				}

				if (rule.selector === 'to-clone') {
					transformedNodes.add(rule);
					rule.cloneBefore({ selector: 'cloned' });
				}
			},
		};
	},
};

export const atRuleClonerPlugin = {
	postcssPlugin: 'at-rule-cloner',
	prepare() {
		const transformedNodes = new WeakSet();

		return {
			AtRuleExit(atRule: AtRule) {
				if (transformedNodes.has(atRule)) {
					return;
				}

				if (atRule.params === 'to-clone') {
					transformedNodes.add(atRule);
					atRule.cloneBefore({ params: 'cloned' });

					return;
				}

				if (atRule.name === 'to-clone') {
					transformedNodes.add(atRule);
					atRule.cloneBefore({ name: 'cloned' });

					return;
				}
			},
		};
	},
};
