import parser from 'postcss-selector-parser';
import { sortCompoundSelectorsInsideComplexSelector } from './compound-selector-order';

export default function mergeSelectors(fromSelectors: string, toSelectors: string) {
	let fromSelectorsAST_Root = parser().astSync(fromSelectors);
	const fromSelectorsWithIsPseudoAST_Root = parser().astSync(`:is(${fromSelectors})`);
	if (!(isSimpleSelector(fromSelectorsAST_Root) || isCompoundSelector(fromSelectorsAST_Root))) {
		fromSelectorsAST_Root = fromSelectorsWithIsPseudoAST_Root;
	}

	const fromSelectorAST = fromSelectorsAST_Root.nodes[0];
	const fromSelectorWithIsPseudoAST = fromSelectorsWithIsPseudoAST_Root.nodes[0];

	const result = [];

	const toSelectorsAST = parser().astSync(toSelectors);
	for (let x = 0; x < toSelectorsAST.nodes.length; x++) {
		const selectorAST = toSelectorsAST.nodes[x];
		selectorAST.rawSpaceAfter = '';
		selectorAST.rawSpaceBefore = '';

		let isNestContaining = false;
		selectorAST.walkNesting(() => {
			isNestContaining = true;
			return false;
		});

		if (!isNestContaining) {
			selectorAST.insertBefore(selectorAST.at(0), parser.combinator({ value: ' ' }));
			selectorAST.insertBefore(selectorAST.at(0), parser.nesting({}));
		} else if (selectorAST.nodes[0]?.type === 'combinator') {
			selectorAST.insertBefore(selectorAST.at(0), parser.nesting({}));
		}

		selectorAST.walkNesting((node) => {
			const parent = node.parent;

			if (node.parent?.parent?.type === 'pseudo' && node.parent?.parent?.value?.toLowerCase() === ':has') {
				node.replaceWith(...((fromSelectorWithIsPseudoAST.clone({}) as parser.Selector).nodes));
			} else {
				node.replaceWith(...((fromSelectorAST.clone({}) as parser.Selector).nodes));
			}

			if (parent?.nodes.length > 1) {
				sortCompoundSelectorsInsideComplexSelector(parent);
			}
		});

		selectorAST.walk((node) => {
			if (node.type === 'combinator' && node.value.trim() !== '') {
				node.rawSpaceAfter = ' ';
				node.rawSpaceBefore = ' ';
			} else {
				node.rawSpaceAfter = '';
				node.rawSpaceBefore = '';
			}
		});

		result.push(selectorAST.toString().trim());
	}

	return result;
}

function isSimpleSelector(root: parser.Root) {
	if (root.nodes?.length !== 1 || root.nodes?.[0]?.length !== 1) {
		return false;
	}

	if (
		root.nodes[0].nodes[0].type === 'combinator' ||
		(
			root.nodes[0].nodes[0].type === 'pseudo' &&
			parser.isPseudoElement(root.nodes[0].nodes[0])
		)
	) {
		return false;
	}

	return true;
}

function isCompoundSelector(root: parser.Root) {
	if (root.nodes?.length !== 1) {
		return false;
	}

	if (root.nodes[0]?.nodes?.some((x) => {
		return x.type === 'combinator' ||
			(
				root.nodes[0].nodes[0].type === 'pseudo' &&
				parser.isPseudoElement(root.nodes[0].nodes[0])
			);
	})) {
		return false;
	}

	return true;
}
