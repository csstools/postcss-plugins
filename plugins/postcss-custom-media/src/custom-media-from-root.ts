import type { ChildNode, Container, Document, Root as PostCSSRoot } from 'postcss';
import { isProcessableCustomMediaRule } from './is-processable-custom-media-rule';
import { parseCustomMedia } from './transform-at-media';

// return custom media from the css root, conditionally removing them
export default function getCustomMedia(root: PostCSSRoot, opts: { preserve?: boolean }): Map<string, { truthy: string, falsy: string }> {
	// initialize custom media
	const customMedia: Map<string, { truthy: string, falsy: string }> = new Map();

	root.walkAtRules((atRule) => {
		if (!isProcessableCustomMediaRule(atRule)) {
			return;
		}

		const parsed = parseCustomMedia(atRule.params);
		if (!parsed) {
			return;
		}

		customMedia.set(parsed.name, {
			truthy: parsed.truthy,
			falsy: parsed.falsy,
		});

		if (!opts.preserve) {
			atRule.remove();
			removeEmptyAncestorBlocks(atRule);
		}
	});

	return customMedia;
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

