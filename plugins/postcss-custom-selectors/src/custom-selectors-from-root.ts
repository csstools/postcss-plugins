import type { ChildNode, Container, Document, Root as PostCSSRoot } from 'postcss';
import type { Root as SelectorRoot } from 'postcss-selector-parser';
import parser from 'postcss-selector-parser';
import { isProcessableCustomSelectorRule } from './is-processable-custom-selector-rule';

// return custom selectors from the css root, conditionally removing them
export default function getCustomSelectors(root: PostCSSRoot, opts: { preserve?: boolean }): Map<string, SelectorRoot> {
	// initialize custom selectors
	const customSelectors = new Map<string, SelectorRoot>();

	root.walkAtRules((atRule) => {
		if (!isProcessableCustomSelectorRule(atRule)) {
			return;
		}

		const source = atRule.params.trim();

		const selectorAST = parser().astSync(source);
		const nameNode = selectorAST?.nodes?.[0]?.nodes?.[0];
		if (!nameNode || nameNode.type !== 'pseudo' || !nameNode.value.startsWith(':--')) {
			return;
		}

		const name = nameNode.toString();

		// re-parsing is important to obtain the correct AST shape
		customSelectors.set(name, parser().astSync(source.slice(name.length).trim()));

		if (!opts.preserve) {
			const parent = atRule.parent;
			atRule.remove();

			removeEmptyAncestorBlocks(parent);
		}
	});

	return customSelectors;
}

function removeEmptyAncestorBlocks(block: Container) {
	let currentNode: Document | Container<ChildNode> = block;

	while (currentNode) {
		if (currentNode.nodes && currentNode.nodes.length > 0) {
			return;
		}

		const parent = currentNode.parent;
		currentNode.remove();
		currentNode = parent;
	}
}
