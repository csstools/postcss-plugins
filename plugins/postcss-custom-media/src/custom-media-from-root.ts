import type { MediaQuery } from '@csstools/media-query-list-parser';
import type { ChildNode, Container, Document, Result, Root as PostCSSRoot } from 'postcss';
import { collectCascadeLayerOrder, cascadeLayerNumberForNode } from './cascade-layers';
import { isProcessableCustomMediaRule } from './is-processable-custom-media-rule';
import { removeCyclicReferences } from './toposort';
import { parseCustomMedia } from './transform-at-media/custom-media';

// return custom media from the css root, conditionally removing them
export default function getCustomMedia(root: PostCSSRoot, result: Result, opts: { preserve?: boolean }): Map<string, { truthy: Array<MediaQuery>, falsy: Array<MediaQuery> }> {
	// initialize custom media
	const customMedia: Map<string, { truthy: Array<MediaQuery>, falsy: Array<MediaQuery> }> = new Map();
	const customMediaCascadeLayerMapping: Map<string, number> = new Map();
	const customMediaGraph: Array<[string, string]> = [];

	const cascadeLayersOrder = collectCascadeLayerOrder(root);

	root.walkAtRules((atRule) => {
		if (!isProcessableCustomMediaRule(atRule)) {
			return;
		}

		const parsed = parseCustomMedia(atRule.params);
		if (!parsed) {
			return;
		}

		if (parsed.truthy.length === 0) {
			return;
		}

		const thisCascadeLayer = cascadeLayerNumberForNode(atRule, cascadeLayersOrder);
		const existingCascadeLayer = customMediaCascadeLayerMapping.get(parsed.name) ?? -1;

		if (thisCascadeLayer && thisCascadeLayer >= existingCascadeLayer) {
			customMediaCascadeLayerMapping.set(parsed.name, thisCascadeLayer);
			customMedia.set(parsed.name, {
				truthy: parsed.truthy,
				falsy: parsed.falsy,
			});

			customMediaGraph.push(...parsed.dependencies);
		}

		if (!opts.preserve) {
			const parent = atRule.parent;
			atRule.remove();
			removeEmptyAncestorBlocks(parent);
		}
	});

	const cyclicReferences = removeCyclicReferences(customMedia, customMediaGraph);
	for (const cyclicReference of cyclicReferences.values()) {
		root.warn(result, `@custom-media rules have cyclic dependencies for "${cyclicReference}"`);
	}

	return customMedia;
}

function removeEmptyAncestorBlocks(block: Container | undefined): void {
	if (!block) {
		return;
	}

	let currentNode: Document | Container<ChildNode> | undefined = block;

	while (currentNode) {
		if (currentNode.nodes && currentNode.nodes.length > 0) {
			return;
		}

		const parent: Document | Container<ChildNode> | undefined = currentNode.parent;
		currentNode.remove();
		currentNode = parent;
	}
}
