import type { AtRule, Declaration, Rule } from 'postcss';
import type { PluginCreator } from 'postcss';
import type { TestCaseOptions } from './test-case-options';
export declare function postcssTape(currentPlugin: PluginCreator<unknown>): (options: Record<string, TestCaseOptions>) => Promise<void>;
export declare const declarationClonerPlugin: {
    postcssPlugin: string;
    Declaration(decl: Declaration): void;
};
export declare const ruleClonerPlugin: {
    postcssPlugin: string;
    prepare(): {
        RuleExit(rule: Rule): void;
    };
};
export declare const atRuleClonerPlugin: {
    postcssPlugin: string;
    prepare(): {
        AtRuleExit(atRule: AtRule): void;
    };
};
