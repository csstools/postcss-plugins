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
    transpile: (nodes: Array<ChildNode>) => Array<AtRule>;
};

export declare type PrivatePropertyTranspilerOptions = {
    namespace?: string;
};

export { }
