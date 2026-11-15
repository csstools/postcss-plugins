import type { AtRule } from 'postcss';
import type { ChildNode } from 'postcss';

/**
 * Create a transpiler for private custom properties.
 *
 * The returned transpiler keeps its state between calls, so that generated
 * names do not collide when it is used for multiple subtrees of one file.
 * Nodes must already be attached to a tree.
 */
export declare function createPrivatePropertyTranspiler(options?: PrivatePropertyTranspilerOptions): PrivatePropertyTranspiler;

export declare type PrivatePropertyTranspiler = {
    /**
     * Transpile private rules and private property references in `nodes`.
     *
     * Mutates `nodes` in place and returns the `@property` rules that must be
     * appended to the root of the tree.
     */
    transpile: (nodes: Array<ChildNode>) => Array<AtRule>;
};

export declare type PrivatePropertyTranspilerOptions = {
    /** Namespace for generated names. */
    namespace?: string;
};

export { }
