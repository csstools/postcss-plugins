import fs from 'fs/promises';
import noopPlugin from './noop-plugin';
import path from 'path';
import postcss from 'postcss';
import postcssOldestSupported, { AcceptedPlugin } from 'postcss-8.4';
import syntaxHTML from 'postcss-html';
import type { AtRule, Declaration, Rule } from 'postcss';
import type { PluginCreator, Plugin, Result } from 'postcss';
import type { TestCaseOptions } from './test-case-options';
import { reduceInformationInCssSyntaxError } from './reduce-css-syntax-error';
import assert from 'node:assert/strict';
import test from 'node:test';
import { fileContentsOrEmptyString } from './file-contents-or-empty-string';

export type { TestCaseOptions } from './test-case-options';

export type Options = {
	/**
	 * PostCSS plugins should start their name with `postcss-`.
	 * If this is something you do not want to do, you can set this to `true` to skip this check.
	 */
	skipPackageNameCheck?: boolean,
}

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

export function postcssTape(currentPlugin: PluginCreator<unknown>, runOptions?: Options) {
	runOptions = runOptions ?? {};

	// Plugin conforms to https://github.com/postcss/postcss/blob/main/docs/guidelines/plugin.md
	test('`postcss` flag is set on exported plugin creator', () => {
		assert.strictEqual(currentPlugin.postcss, true);
	});

	test('exported plugin creator is a function', () => {
		assert.strictEqual(typeof currentPlugin, 'function');
	});

	test('`postcssPlugin` is set on a plugin instance', () => {
		// https://github.com/postcss/postcss/blob/main/docs/guidelines/plugin.md#15-set-pluginpostcssplugin-with-plugin-name
		// Set plugin.postcssPlugin with plugin name

		const plugin = currentPlugin() as Plugin;

		assert.ok(plugin.postcssPlugin);
		assert.strictEqual(typeof plugin.postcssPlugin, 'string');
	});

	test('package.json', async (t) => {
		const packageData = await fs.readFile('./package.json', 'utf-8');
		const packageInfo = JSON.parse(packageData);

		await t.test('includes "postcss-plugin" keyword', () => {
			// https://github.com/postcss/postcss/blob/main/docs/guidelines/plugin.md#54-include-postcss-plugin-keyword-in-packagejson
			// Include postcss-plugin keyword in package.json

			assert.ok(packageInfo.keywords);
			assert.ok(packageInfo.keywords.includes('postcss-plugin'));
		});

		const skipPackageNameCheck = runOptions?.skipPackageNameCheck || [
			'css-has-pseudo',
			'css-blank-pseudo',
			'css-prefers-color-scheme',
			'@csstools/css-has-pseudo-experimental',
		].includes(packageInfo.name);

		await t.test('name starts with "postcss-"', {skip: skipPackageNameCheck}, () => {
			// https://github.com/postcss/postcss/blob/main/docs/guidelines/plugin.md#11-clear-name-with-postcss--prefix
			// Clear name with postcss- prefix

			let packageName = packageInfo.name;
			if (packageName.startsWith('@')) {
				const parts = packageInfo.name.split('/');
				packageName = parts.slice(1).join('/');
			}

			assert.ok(packageName.startsWith('postcss-'), `package name "${packageName}" does not start with "postcss-"`);
		});

		await t.test('`postcss` is a peer dependency and not a direct dependency', { skip: ('postcssTapeSelfTest' in currentPlugin) }, () => {
			// https://github.com/postcss/postcss/blob/main/docs/guidelines/plugin.md#14-keep-postcss-to-peerdependencies
			// Keep postcss to peerDependencies

			assert.ok(packageInfo.peerDependencies);
			assert.ok(Object.keys(Object(packageInfo.peerDependencies)).includes('postcss'));
			assert.ok(!Object.keys(Object(packageInfo.dependencies)).includes('postcss'));
		});
	});

	const pluginName = (currentPlugin() as Plugin).postcssPlugin;

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

					const input = await fileContentsOrEmptyString(testFilePath);
					const expected = await fileContentsOrEmptyString(expectFilePath);

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
							return;
						}

						assert.ifError(err);
					}

					assert.notEqual(!sawException, testCaseOptions.exception, 'expected an exception but got none');

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

					assert.ok(expected, 'Missing expected result file');

					await t2.test('has expected output', () => {
						assert.strictEqual(resultString, expected);

						// Assert that warnings have the expected amount.
						assert.deepStrictEqual(result.warnings().length, testCaseOptions.warnings ?? 0, 'Unexpected number warnings');
					});

					// Assert result sourcemaps with recent PostCSS.
					await t2.test('sourcemaps', { skip: !postcssSyntaxSupportsSourceMaps(testCaseOptions) }, async () => {
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
							map: postcssSyntaxSupportsSourceMaps(testCaseOptions) ? {
								inline: false,
								annotation: false,
							} : false,
							syntax: postcssSyntax(testCaseOptions),
						});

						assert.deepStrictEqual(secondPassResult.warnings(), [], 'Unexpected warnings on second pass');
					});

					await t2.test(
						'The oldest and current PostCSS version produce the same result',
						{ skip: postcss([noopPlugin()]).version === postcssOldestSupported([noopPlugin()]).version },
						async () => {
							const resultFromOldestPostCSS = await postcssOldestSupported(plugins as Array<AcceptedPlugin>).process(input, {
								from: testFilePath,
								to: resultFilePath,
								map: postcssSyntaxSupportsSourceMaps(testCaseOptions) ? {
									inline: false,
									annotation: false,
								} : false,
							});

							assert.strictEqual(resultFromOldestPostCSS.css.toString(), resultString);
						},
					);
				});
			}
		});
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
