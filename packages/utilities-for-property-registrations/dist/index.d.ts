import type { AtRule } from 'postcss';
import type { ChildNode } from 'postcss';
import type { Container } from 'postcss';

export declare type CollectedPropertyRegistration = {
    atRule: AtRule;
    conditionals: Array<AtRule>;
};

/** Collect the `@property` rules of a container, with the conditionals around each rule. */
export declare function collectPropertyRegistrations(container: Container<ChildNode>, options: CollectPropertyRegistrationsOptions): Array<CollectedPropertyRegistration>;

export declare type CollectPropertyRegistrationsOptions = {
    isConditional: (atRule: AtRule) => boolean;
    shouldDescend: (atRule: AtRule) => boolean;
};

/** Format a generated node tree. */
export declare function formatGeneratedNode(node: ChildNode, before: string, indent: string): void;

export declare type HoistedPropertyRegistrations = {
    registrations: Array<AtRule>;
    names: Array<string>;
};

/** Clone, rename, wrap and format `@property` rules so they can be moved to the root. */
export declare function hoistPropertyRegistrations(collected: Array<CollectedPropertyRegistration>, options: HoistPropertyRegistrationsOptions): HoistedPropertyRegistrations;

export declare type HoistPropertyRegistrationsOptions = {
    rewrite: (name: string) => string;
    conditionals?: Array<AtRule>;
    removeOriginal?: boolean;
};

/** The names of every property registered by an `@property` rule. */
export declare function registeredPropertyNames(atRule: AtRule): Array<string>;

/**
 * Rewrite the custom property names in the prelude of an `@property` rule.
 *
 * Both the longhand comma separated prelude list and the shorthand form are
 * supported:
 *
 * ```css
 * @property --a, --b { syntax: "<length>"; }
 * @property --a <length>: 1em;
 * ```
 *
 * Returns the original names, or `null` when the rule is invalid.
 */
export declare function rewritePropertyNames(atRule: AtRule, rewrite: (name: string) => string): Array<string> | null;

/** Wrap nodes in clones of the conditional group rules that contain them. */
export declare function wrapInConditionals<T extends ChildNode>(nodes: Array<T>, conditionals: Array<AtRule>): Array<T>;

export { }
