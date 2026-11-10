import type { AtRule } from 'postcss';
import type { Declaration } from 'postcss';
import type { Helpers } from 'postcss';
import type { Node } from 'postcss';

/**
 * Expand a single `@property` rule into one longhand `@property` rule per
 * registered property name.
 *
 * The longhand form accepts a comma separated prelude list:
 *
 * ```css
 * @property --a, --b { syntax: "<length>"; }
 * ```
 *
 * The shorthand form describes exactly one property and may contain commas in
 * its initial value:
 *
 * ```css
 * @property --a <length>: 1em;
 * @property --b type(<color>#): red, blue;
 * ```
 *
 * Returns `null` when the rule is invalid.
 */
export declare function expandPropertyRule(atRule: AtRule, postcss: Helpers): Array<AtRule> | null;

/**
 * Check if a declaration has a fallback.
 * Returns true if a declaration with the same property name appears before the current declaration.
 *
 * @param {Declaration} node The declaration node to check
 * @returns {boolean} Whether the declaration has a fallback
 */
export declare function hasFallback(node: Declaration): boolean;

/**
 * Check if a node has a `@supports` at-rule ancestor with a given regex in its params.
 *
 * @param {Node} node The node to check
 * @param {{ test(str: string): boolean }} predicate The test to match against the `@supports` at-rule's params
 * @returns {boolean}
 */
export declare function hasSupportsAtRuleAncestor(node: Node, predicate: {
    test(str: string): boolean;
}): boolean;

/** The names of every property registered by an `@property` rule. */
export declare function registeredPropertyNames(atRule: AtRule): Array<string>;

export { }
