import type { AtRule, ChildNode } from 'postcss';
import { Transpiler } from './transpiler';

export type PrivatePropertyTranspilerOptions = {
	/** Namespace for generated names. */
	namespace?: string,
};

export type PrivatePropertyTranspiler = {
	/**
	 * Transpile private rules and private property references in `nodes`.
	 *
	 * Mutates `nodes` in place and returns the `@property` rules that must be
	 * appended to the root of the tree.
	 */
	transpile: (nodes: Array<ChildNode>) => Array<AtRule>,
};

/**
 * Create a transpiler for private custom properties.
 *
 * The returned transpiler keeps its state between calls, so that generated
 * names do not collide when it is used for multiple subtrees of one file.
 * Nodes must already be attached to a tree.
 */
export function createPrivatePropertyTranspiler(options?: PrivatePropertyTranspilerOptions): PrivatePropertyTranspiler {
	const transpiler = new Transpiler(options?.namespace);

	return {
		transpile(nodes: Array<ChildNode>): Array<AtRule> {
			return transpiler.transpile(nodes);
		},
	};
}
