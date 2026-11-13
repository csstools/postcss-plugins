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
    private nonHoistableOwners;
    counter: number;
    hashes: Map<string, string>;
    /** `@property` registrations generated for private properties. */
    private registrations;
    /**
     * Take the `@property` registrations that were generated for private
     * properties. These are top level rules and must be appended to the root.
     */
    getRegisteredPropertyAtRules(): Array<AtRule>;
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
    /**
     * Remove a private rule and any conditional group rules that only
     * contained it.
     */
    private removePrivateRule;
    /**
     * Whether any `@private` rule for this style rule has a registration that
     * can not be hoisted to the root.
     *
     * A private property name is scoped to the style rule, so all private rules
     * of a style rule must be transpiled or none of them.
     */
    private hasNonHoistableRegistration;
    /**
     * Move `@property` rules to the root with the generated private property
     * names, so they provide the registration for the private properties.
     */
    private extractPropertyRules;
    transpileDeclaration(decl: Declaration): void;
    transpileDeclarationPropertyNames(decl: Declaration): void;
    transpileDeclarationValues(decl: Declaration): void;
    transpileAtRule(atRule: AtRule): void;
    private rewritePrivatePropertyName;
}

export { }
