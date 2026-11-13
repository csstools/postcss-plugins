import type { AtRule, ChildNode, Rule } from 'postcss';
import { findStyleRule, IS_PRIVATE_RULE_REGEX } from './valid-atrules';
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
			for (const node of nodes) {
				if (!isContainer(node)) {
					continue;
				}

				node.walkAtRules(IS_PRIVATE_RULE_REGEX, (atRule) => {
					transpilePrivateRule(transpiler, atRule);
				});
			}

			for (const node of nodes) {
				if (node.type === 'atrule' && IS_PRIVATE_RULE_REGEX.test(node.name)) {
					transpilePrivateRule(transpiler, node);
				}
			}

			for (const node of nodes) {
				if (node.type === 'decl') {
					transpiler.transpileDeclaration(node);
					continue;
				}

				if (isContainer(node)) {
					node.walkDecls((decl) => transpiler.transpileDeclaration(decl));
				}
			}

			for (const node of nodes) {
				if (node.type === 'atrule') {
					transpiler.transpileAtRule(node);
					continue;
				}

				if (isContainer(node)) {
					node.walkAtRules((atRule) => transpiler.transpileAtRule(atRule));
				}
			}

			return transpiler.getRegisteredPropertyAtRules();
		},
	};
}

function transpilePrivateRule(transpiler: Transpiler, atRule: AtRule): void {
	const owner = findStyleRule(atRule);
	if (!owner) {
		return;
	}

	transpiler.registerAndRemovePrivateRules(atRule, owner);
}

function isContainer(node: ChildNode): node is Rule | AtRule {
	return node.type === 'rule' || node.type === 'atrule';
}
