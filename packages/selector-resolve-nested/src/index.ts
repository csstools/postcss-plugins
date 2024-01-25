/**
 * Resolve nested selectors following the CSS nesting specification.
 *
 * @example
 *
 * ```js
 * import { resolveNestedSelector } from '@csstools/selector-resolve-nested';
 * import parser from 'postcss-selector-parser';
 *
 * const selector = parser().astSync('.foo &');
 * const parent = parser().astSync('.bar');
 *
 * // .foo .bar
 * console.log(
 *   resolveNestedSelector(selector, parent).toString()
 * )
 * ```
 *
 * @packageDocumentation
 */

import type { Container, Node, Root, Selector } from 'postcss-selector-parser';
import parser from 'postcss-selector-parser';
import { sortCompoundSelectorsInsideComplexSelector } from './compound-selector-order';
import { sourceFrom } from './source';

/**
 * Resolve a nested selector against a given parent selector.
 *
 * @param selector - The selector to resolve.
 * @param parentSelector - The parent selector to resolve against.
 * @returns The resolved selector.
 */
export function resolveNestedSelector(selector: Root, parentSelector: Root): Root {
	const result: Array<Selector> = [];

	for (let x = 0; x < selector.nodes.length; x++) {
		const selectorAST = selector.nodes[x].clone();

		{
			let isNestContaining = false;
			selectorAST.walkNesting(() => {
				isNestContaining = true;
				return false;
			});

			if (!isNestContaining) {
				selectorAST.prepend(parser.combinator({ value: ' ', ...sourceFrom(selectorAST) }));
				selectorAST.prepend(parser.nesting({ ...sourceFrom(selectorAST) }));
			} else if (selectorAST.nodes[0]?.type === 'combinator') {
				selectorAST.prepend(parser.nesting({ ...sourceFrom(selectorAST) }));
			}
		}

		{
			const needsSorting = new Set<Container<string, Node>>();

			selectorAST.walkNesting((node) => {
				const parent = node.parent!;

				needsSorting.add(parent);
				if (parent.parent?.type === 'pseudo' && parent.parent.value?.toLowerCase() === ':has') {
					node.replaceWith(...prepareParentSelectors(parentSelector, true));
				} else {
					node.replaceWith(...prepareParentSelectors(parentSelector));
				}
			});

			for (const parent of needsSorting) {
				sortCompoundSelectorsInsideComplexSelector(parent);
			}
		}

		selectorAST.walk((node) => {
			if (node.type === 'combinator' && node.value.trim() !== '') {
				node.rawSpaceAfter = ' ';
				node.rawSpaceBefore = ' ';
			} else {
				node.rawSpaceAfter = '';
				node.rawSpaceBefore = '';
			}
		});

		result.push(selectorAST);
	}

	const root = parser.root({
		value: '',
		...sourceFrom(selector),
	});

	result.forEach((x) => {
		root.append(x);
	});

	return root;
}

function prepareParentSelectors(parentSelectors: Root, forceIsPseudo: boolean = false) {
	if (
		forceIsPseudo ||
		!isCompoundSelector(parentSelectors.nodes)
	) {

		const isPseudo = parser.pseudo({
			value: ':is',
			...sourceFrom(parentSelectors),
		});

		parentSelectors.nodes.forEach((x) => {
			isPseudo.append(x.clone());
		});

		return [
			isPseudo,
		];
	}

	return parentSelectors.nodes[0].nodes.map((x) => x.clone());
}

function isCompoundSelector(selectors: Array<Selector>): boolean {
	// Selector list with multiple entries is not only a compound selector
	if (selectors.length !== 1) {
		return false;
	}

	// A selector with combinators or pseudo elements is not a compound selector
	return !selectors[0].nodes.some((x) => {
		return x.type === 'combinator' || parser.isPseudoElement(x);
	});
}
