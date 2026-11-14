import type { AtRule } from 'postcss';
import type { ChildNode } from 'postcss';
import type { Container } from 'postcss';

/** An `@property` rule and the conditional group rules around it. */
export declare interface CollectedPropertyRegistration {
    /** The `@property` rule. */
    propertyRule: AtRule;
    /** The conditional group rules around the `@property` rule, outermost first. */
    conditionalGroupRules: Array<AtRule>;
}

/**
 * Collect the `@property` rules in a container and the conditional group rules around each rule.
 *
 * @param container - The container to search.
 * @param options - The collection policy.
 */
export declare function collectPropertyRegistrations(container: Container<ChildNode>, options: CollectPropertyRegistrationsOptions): Array<CollectedPropertyRegistration>;

/** Options for collecting `@property` rules. */
export declare interface CollectPropertyRegistrationsOptions {
    /** Whether an at-rule is a conditional group rule. */
    isConditionalGroupRule: (atRule: AtRule) => boolean;
    /** Whether to descend into an at-rule to find nested `@property` rules. */
    shouldDescendInto: (atRule: AtRule) => boolean;
}

/** The hoisted `@property` rules and their original names. */
export declare interface HoistedPropertyRegistrations {
    /** The cloned, rewritten and wrapped `@property` rules. */
    registrations: Array<AtRule>;
    /** The `<custom-property-name>` values from before rewriting. */
    originalNames: Array<string>;
}

/**
 * Clone, rewrite and wrap `@property` rules so they can be moved to the root.
 *
 * @param collected - The collected registrations.
 * @param options - The hoisting policy.
 */
export declare function hoistPropertyRegistrations(collected: Array<CollectedPropertyRegistration>, options: HoistPropertyRegistrationsOptions): HoistedPropertyRegistrations;

/** Options for hoisting `@property` rules. */
export declare interface HoistPropertyRegistrationsOptions {
    /** The new `<custom-property-name>` for each original name. */
    rewriteCustomPropertyName: (name: string) => string;
    /** Conditional group rules to wrap every registration in, outermost first. */
    conditionalGroupRules?: Array<AtRule>;
    /** Whether to remove the collected `@property` rules. */
    removeOriginal?: boolean;
}

/**
 * The `<custom-property-name>` values registered by an `@property` rule.
 *
 * @param atRule - The `@property` rule.
 */
export declare function registeredCustomPropertyNames(atRule: AtRule): Array<string>;

/**
 * Rewrite the `<custom-property-name>` values in the prelude of an `@property` rule.
 *
 * Supports both the rule form and the statement form.
 *
 * @param atRule - The `@property` rule.
 * @param rewriteCustomPropertyName - Maps each original name to its new name.
 * @returns The original `<custom-property-name>` values, or `null` when the prelude cannot be parsed.
 */
export declare function rewriteCustomPropertyNames(atRule: AtRule, rewriteCustomPropertyName: (name: string) => string): Array<string> | null;

/**
 * Wrap nodes in clones of the given conditional group rules, outermost first.
 *
 * @param nodes - The nodes to wrap.
 * @param conditionalGroupRules - The rules to clone, outermost first.
 */
export declare function wrapInConditionalGroupRules<T extends ChildNode>(nodes: Array<T>, conditionalGroupRules: Array<AtRule>): Array<T | AtRule>;

export { }
