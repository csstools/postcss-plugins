import parser from 'postcss-selector-parser';
import type { Root } from 'postcss-selector-parser';
import type { Node, Result } from 'postcss';
import { resolveNestedSelector } from '@csstools/selector-resolve-nested';

const selectorParser = parser();

export default function mergeSelectors(node: Node, nodeSelector: string, parentSelector: string, result: Result): string|false {
	let selectors: Root;

	// update the selectors of the node to be merged with the parent
	try {
		selectors = resolveNestedSelector(
			selectorParser.astSync(nodeSelector),
			selectorParser.astSync(parentSelector),
		);
	} catch (err) {
		node.warn(result, `Failed to parse selectors : "${parentSelector}" / "${nodeSelector}" with message: "${(err instanceof Error) ? err.message : err}"`);
		return false;
	}

	if (!selectors) {
		return false;
	}

	return selectors.toString();
}
