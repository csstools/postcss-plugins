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

import type { AtRule } from 'postcss';
import type { Declaration } from 'postcss';
import type { Plugin } from 'postcss';
import type { PluginCreator } from 'postcss';
import type { Rule } from 'postcss';

/**
 * A dummy PostCSS plugin that clones any at rule with params `to-clone` to a new at rule with params `cloned`.
 */
export declare const atRuleClonerPlugin: {
    postcssPlugin: string;
    prepare(): {
        AtRuleExit(atRule: AtRule): void;
    };
};

/**
 * A dummy PostCSS plugin that clones any declaration with the property `to-clone` to a new declaration with the property `cloned`.
 */
export declare const declarationClonerPlugin: {
    postcssPlugin: string;
    Declaration(decl: Declaration): void;
};

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
export declare type Options = {
    /**
     * PostCSS plugins should start their name with `postcss-`.
     * If this is something you do not want to do, you can set this to `true` to skip this check.
     */
    skipPackageNameCheck?: boolean;
};

/**
 * Create a test suite for a PostCSS plugin.
 */
export declare function postcssTape(currentPlugin: PluginCreator<unknown>, runOptions?: Options): (options: Record<string, TestCaseOptions>) => Promise<void>;

/**
 * A dummy PostCSS plugin that clones any rule with the selector `to-clone` to a new rule with the selector `cloned`.
 */
export declare const ruleClonerPlugin: {
    postcssPlugin: string;
    prepare(): {
        RuleExit(rule: Rule): void;
    };
};

/**
 * Options for a test case.
 */
export declare type TestCaseOptions = {
    /** Debug message */
    message?: string;
    /** Plugin options. Only used if `plugins` is not specified. */
    options?: unknown;
    /** Plugins to use. When specified the original plugin is not used. */
    plugins?: Array<Plugin>;
    /** The expected number of warnings. */
    warnings?: number;
    /** Expected exception */
    exception?: RegExp;
    /** Override the file name of the "expect" file. */
    expect?: string;
    /** Override the file name of the "result" file. */
    result?: string;
    /** Do something before the test is run. */
    before?: () => void | Promise<void>;
    /** Do something after the test is run. */
    after?: () => void | Promise<void>;
};

export { }
