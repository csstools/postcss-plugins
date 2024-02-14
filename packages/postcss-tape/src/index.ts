/**
 * A test suite for PostCSS plugins.
 *
 * @example
 * ```sh
 * node --test
 * ```
 *
 * ```js
 * // test/_tape.mjs
 * import { postcssTape } from '@csstools/postcss-tape';
 * import plugin from '<your plugin package name>';
 *
 * postcssTape(plugin)({
 * 	basic: {
 * 		message: "supports basic usage",
 * 	},
 * 	'basic:color': {
 * 		message: "supports { color: '<a color>' }",
 * 		options: {
 * 			color: 'purple'
 * 		}
 * 	},
 * });
 * ```
 *
 * @packageDocumentation
 */

import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import noopPlugin from './noop-plugin';
import path from 'node:path';
import postcss from 'postcss';
import postcssOldestSupported from 'postcss-8.4';
import test from 'node:test';
import url from 'node:url';
import { fileContentsOrEmptyString } from './file-contents-or-empty-string';
import { reduceInformationInCssSyntaxError } from './reduce-css-syntax-error';

import type { AcceptedPlugin } from 'postcss-8.4';
import type { AtRule, Declaration, Rule } from 'postcss';
import type { PluginCreator, Plugin, Result } from 'postcss';
import type { TestCaseOptions } from './test-case-options';
import typeCheckerPlugin from './type-checker-plugin';

export type { TestCaseOptions } from './test-case-options';

/**
 * General options for `@csstools/postcss-tape`.
 * These affect the entire test run, not individual test cases.
 *
 * @example
 * ```js
 * import { postcssTape } from '@csstools/postcss-tape';
 * import plugin from 'your-postcss-plugin';
 *
 * postcssTape(plugin, {
 *   skipPackageNameCheck: true,
 * })(...);
 * ```
 */
export type Options = {
	/**
	 * PostCSS plugins should start their name with `postcss-`.
	 * If this is something you do not want to do, you can set this to `true` to skip this check.
	 */
	skipPackageNameCheck?: boolean,
}

/**
 * Create a test suite for a PostCSS plugin.
 */
export function postcssTape(pluginCreator: PluginCreator<unknown>, runOptions?: Options) {
	runOptions = runOptions ?? {};

	// Plugin conforms to https://github.com/postcss/postcss/blob/main/docs/guidelines/plugin.md
	test('`postcss` flag is set on exported plugin creator', () => {
		assert.equal(pluginCreator.postcss, true);
	});

	test('exported plugin creator is a function', () => {
		assert.equal(typeof pluginCreator, 'function');
	});

	test('`postcssPlugin` is set on a plugin instance', () => {
		// https://github.com/postcss/postcss/blob/main/docs/guidelines/plugin.md#15-set-pluginpostcssplugin-with-plugin-name
		// Set plugin.postcssPlugin with plugin name

		const plugin = pluginCreator() as Plugin;

		assert.ok(plugin.postcssPlugin);
		assert.equal(typeof plugin.postcssPlugin, 'string');
	});

	test('package.json', async (t) => {
		const packageData = await fs.readFile('./package.json', 'utf-8');
		const packageInfo = JSON.parse(packageData);

		await t.test('includes "postcss-plugin" keyword', () => {
			// https://github.com/postcss/postcss/blob/main/docs/guidelines/plugin.md#54-include-postcss-plugin-keyword-in-packagejson
			// Include postcss-plugin keyword in package.json

			assert.ok(
				packageInfo.keywords?.includes('postcss-plugin'),
				new PackageDescriptionError('Missing "postcss-plugin" keyword in package.json', 'keywords'),
			);
		});

		await t.test('name starts with "postcss-"', { skip: runOptions?.skipPackageNameCheck }, () => {
			// https://github.com/postcss/postcss/blob/main/docs/guidelines/plugin.md#11-clear-name-with-postcss--prefix
			// Clear name with postcss- prefix

			let packageName = packageInfo.name;
			if (packageName.startsWith('@')) {
				const parts = packageInfo.name.split('/');
				packageName = parts.slice(1).join('/');
			}

			assert.ok(
				packageName.startsWith('postcss-'),
				new PackageDescriptionError(`package name "${packageName}" does not start with "postcss-"`, 'name'),
			);
		});

		await t.test('`postcss` is a peer dependency and not a direct dependency', { skip: ('postcssTapeSelfTest' in pluginCreator) }, () => {
			// https://github.com/postcss/postcss/blob/main/docs/guidelines/plugin.md#14-keep-postcss-to-peerdependencies
			// Keep postcss to peerDependencies

			assert.ok(
				Object.keys(Object(packageInfo.peerDependencies)).includes('postcss'),
				new PackageDescriptionError('"postcss" must be listed in "peerDependencies"', 'peerDependencies'),
			);
			assert.ok(
				!Object.keys(Object(packageInfo.dependencies)).includes('postcss'),
				new PackageDescriptionError('"postcss" must not be listed in "dependencies"', 'dependencies'),
			);
		});
	});

	const pluginName = (pluginCreator() as Plugin).postcssPlugin;

	// Test cases
	return async (options: Record<string, TestCaseOptions>) => {
		await test(pluginName, async (t1) => {
			for (const testCaseLabel in options) {
				await t1.test(testCaseLabel, async (t2) => {
					const testCaseOptions = options[testCaseLabel];

					// Run "before" immediately.
					if (testCaseOptions.before) {
						await testCaseOptions.before();
					}

					const testSourceFilePathWithoutExtension = path.join('.', 'test', ...(testCaseLabel.split(':')[0]).split(path.posix.sep));
					const testFilePathWithoutExtension = path.join('.', 'test', ...testCaseLabel.replace(/:/g, '.').split(path.posix.sep));

					const extension = 'css';
					let testFilePath = `${testSourceFilePathWithoutExtension}.${extension}`;
					let expectFilePath = `${testFilePathWithoutExtension}.expect.${extension}`;
					let resultFilePath = `${testFilePathWithoutExtension}.result.${extension}`;

					if (testCaseOptions.source) {
						testFilePath = path.join('.', 'test', testCaseOptions.source);
					}
					if (testCaseOptions.expect) {
						expectFilePath = path.join('.', 'test', testCaseOptions.expect);
					}
					if (testCaseOptions.result) {
						resultFilePath = path.join('.', 'test', testCaseOptions.result);
					}

					const plugins = testCaseOptions.plugins ?? [pluginCreator(testCaseOptions.options)];
					plugins.push(typeCheckerPlugin());

					const input = await fileContentsOrEmptyString(testFilePath);
					const expected = await fileContentsOrEmptyString(expectFilePath);

					let result: Result;

					try {
						result = await postcss(plugins).process(input, {
							from: testFilePath,
							to: resultFilePath,
							map: {
								inline: false,
								annotation: false,
							},
						});
					} catch (err) {
						reduceInformationInCssSyntaxError(err);
						if (testCaseOptions.exception && testCaseOptions.exception.test(err.message)) {
							// expected an exception and got one.
							return;
						}

						throw err;
					}

					assert.ok(
						!testCaseOptions.exception,
						new OutcomeError(`expected an exception matching "${testCaseOptions.exception}"`, testFilePath),
					);

					const resultString = result.css.toString();

					// Try to write the result file, even if further checks fails.
					// This helps writing new tests for plugins.
					// Taking the result file as a starting point for the expect file.
					{
						const fileWriters: Array<Promise<void>> = [fs.writeFile(resultFilePath, resultString, 'utf8')];

						// Allow contributors to rewrite `.expect.css` files through postcss-tape.
						if (process.env.REWRITE_EXPECTS) {
							fileWriters.push(fs.writeFile(expectFilePath, resultString, 'utf8'));
						}

						await Promise.all(fileWriters);
					}

					if (!expected) {
						assert.ok(
							fsSync.existsSync(expectFilePath),
							new OutcomeError(`Missing expect file: "${expectFilePath}"`, testFilePath),
						);
					}

					await t2.test('has expected output', () => {
						assert.deepEqual(resultString, expected);

						// Assert that warnings have the expected amount.
						assert.deepEqual(result.warnings().length, testCaseOptions.warnings ?? 0, 'Unexpected number warnings');
					});

					// Assert result sourcemaps with recent PostCSS.
					await t2.test('sourcemaps', async () => {
						assert.ok(!result.map.toJSON().sources.includes('<no source>'), 'Sourcemap is broken. This is most likely a newly created PostCSS AST Node without a value for "source". See: https://github.com/postcss/postcss/blob/main/docs/guidelines/plugin.md#24-set-nodesource-for-new-nodes');
					});

					// Run "after" when initial postcss run has completely.
					if (testCaseOptions.after) {
						await testCaseOptions.after();
					}

					// Assert that the result can be passed back to PostCSS and still parses.
					await t2.test('output is parsable with PostCSS', async () => {
						const resultContents = await fileContentsOrEmptyString(resultFilePath);
						const secondPassResult = await postcss([noopPlugin()]).process(resultContents, {
							from: resultFilePath,
							to: resultFilePath,
							map: {
								inline: false,
								annotation: false,
							},
						});

						assert.deepEqual(secondPassResult.warnings(), [], 'Unexpected warnings on second pass');
					});

					await t2.test(
						'The oldest and current PostCSS version produce the same result',
						{ skip: postcss([noopPlugin()]).version === postcssOldestSupported([noopPlugin()]).version },
						async () => {
							const resultFromOldestPostCSS = await postcssOldestSupported(plugins as Array<AcceptedPlugin>).process(input, {
								from: testFilePath,
								to: resultFilePath,
								map: {
									inline: false,
									annotation: false,
								},
							});

							assert.deepEqual(resultFromOldestPostCSS.css.toString(), resultString);
						},
					);
				});
			}
		});
	};
}

/**
 * A dummy PostCSS plugin that clones any declaration with the property `to-clone` to a new declaration with the property `cloned`.
 */
export const declarationClonerPlugin = {
	postcssPlugin: 'declaration-cloner',
	Declaration(decl: Declaration) {
		if (decl.prop === 'to-clone') {
			decl.cloneBefore({ prop: 'cloned' });
		}
	},
};

/**
 * A dummy PostCSS plugin that clones any rule with the selector `to-clone` to a new rule with the selector `cloned`.
 */
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

/**
 * A dummy PostCSS plugin that clones any at rule with params `to-clone` to a new at rule with params `cloned`.
 */
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

class PackageDescriptionError extends Error {
	constructor(message: string, key: string) {
		super(message);

		this.name = 'PackageDescriptionError';
		this.stack = `${this.name}: ${this.message}\n    at "${key}" (${url.pathToFileURL(path.resolve('package.json'))}:1:1)`;
	}
}

class OutcomeError extends Error {
	constructor(message: string, sourceFile: string) {
		super(message);

		this.name = 'OutcomeError';
		this.stack = `${this.name}: ${this.message}\n    at ${url.pathToFileURL(path.resolve(sourceFile))}:1:1`;
	}
}
