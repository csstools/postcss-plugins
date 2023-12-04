import { AtRule, Declaration, Rule, PluginCreator, Plugin } from 'postcss';
type TestCaseOptions = {
    /** Debug message */
    message?: string;
    /** Plugin options. Only used if `plugins` is not specified. */
    options?: unknown;
    /** Plugins to use. When specified the original plugin is not used. */
    plugins?: Array<Plugin>;
    /** The expected number of warnings. */
    warnings?: number;
    /** Expected exception */
    /** NOTE: plugins should not throw exceptions, this goes against best practices. Use `errors` instead. */
    exception?: RegExp;
    /** Override the file name of the "expect" file. */
    expect?: string;
    /** Override the file name of the "result" file. */
    result?: string;
    /** Do something before the test is run. */
    before?: () => void;
    /** Do something after the test is run. */
    after?: () => void | Promise<void>;
    /** Process the test cases with "postcss-html" as the syntax */
    postcssSyntaxHTML?: boolean;
};
declare function postcssTape(currentPlugin: PluginCreator<unknown>): (options: Record<string, TestCaseOptions>) => Promise<void>;
declare const declarationClonerPlugin: {
    postcssPlugin: string;
    Declaration(decl: Declaration): void;
};
declare const ruleClonerPlugin: {
    postcssPlugin: string;
    prepare(): {
        RuleExit(rule: Rule): void;
    };
};
declare const atRuleClonerPlugin: {
    postcssPlugin: string;
    prepare(): {
        AtRuleExit(atRule: AtRule): void;
    };
};
export { postcssTape, declarationClonerPlugin, ruleClonerPlugin, atRuleClonerPlugin };
