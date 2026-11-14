import type { AtRule, ChildNode } from 'postcss';
import { Transpiler } from './transpiler';

export type PrivatePropertyTranspilerOptions = {
	namespace?: string,
};

export type PrivatePropertyTranspiler = {
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
