import type { AtRule } from 'postcss';
import type { Declaration } from 'postcss';
import type { Node } from 'postcss';
import type { PluginCreator } from 'postcss';
import type { Rule } from 'postcss';

declare const creator: PluginCreator<pluginOptions>;
export default creator;
export { creator as 'module.exports' }

/** postcss-private-rule plugin options */
export declare type pluginOptions = never;

export declare class Transpiler {
    privateForRule: WeakMap<Rule | AtRule, {
        prefix: string;
        privateProperties: Set<string>;
    }>;
    counter: number;
    hashes: Map<string, string>;
    getOrFillPrivateForRule(rule: Rule | AtRule): {
        prefix: string;
        privateProperties: Set<string>;
    };
    getStyleRulesWithPrivateProperties(node: Node): Array<{
        prefix: string;
        privateProperties: Set<string>;
        rule: Rule;
    }>;
    registerAndRemovePrivateRules(atRule: AtRule, ownerNode: AtRule | Rule): void;
    transpileDeclaration(decl: Declaration): void;
    transpileDeclarationPropertyNames(decl: Declaration): void;
    transpileDeclarationValues(decl: Declaration): void;
    transpileAtRule(atRule: AtRule): void;
}

export { }
