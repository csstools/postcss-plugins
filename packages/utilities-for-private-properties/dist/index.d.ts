import type { AtRule } from 'postcss';
import type { ChildNode } from 'postcss';
import type { Rule } from 'postcss';

/**
 * Create a transpiler for private custom properties.
 *
 * The returned transpiler keeps its state between calls, so that generated
 * names do not collide when it is used for multiple subtrees of one file.
 * Nodes must already be attached to a tree.
 */
export declare function createPrivatePropertyTranspiler(options?: PrivatePropertyTranspilerOptions): PrivatePropertyTranspiler;

export declare type PrivatePropertyTranspileOptions = {
    /**
     * Style rule that owns the private property names of `nodes`.
     *
     * Use this when `nodes` are substituted into a style rule but are not its
     * direct children, for example a `@contents` block that is authored at an
     * `@apply` site and placed inside a mixin body.
     */
    scope?: Rule;
};

export declare type PrivatePropertyTranspiler = {
    /**
     * Transpile private rules and private property references in `nodes`.
     *
     * Mutates `nodes` in place and returns the `@property` rules that must be
     * appended to the root of the tree.
     */
    transpile: (nodes: Array<ChildNode>, options?: PrivatePropertyTranspileOptions) => Array<AtRule>;
};

export declare type PrivatePropertyTranspilerOptions = {
    /** Namespace for generated names. */
    namespace?: string;
    /**
     * Whether `@apply` and `@contents` rules in the nodes are expanded later.
     *
     * When `true`, style rules that contain them are still transpiled. This is
     * used by `postcss-mixins`, which expands `@apply` and `@contents` itself.
     * Defaults to `false`: style rules with `@apply` or `@contents` are left
     * untouched because those can substitute declarations that reference
     * private properties.
     */
    allowUntranspiledMixins?: boolean;
    /**
     * Keep `@private` rules and leave references inside `@apply` and `@contents`
     * blocks alone.
     *
     * Transpiled declarations are still hoisted, so the original notation keeps
     * working where `@private` is supported.
     */
    preserve?: boolean;
};

export { }
