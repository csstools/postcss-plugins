import parser from 'postcss-selector-parser';
import { sortCompoundSelectorsInsideComplexSelector } from './compound-selector-order';
import { childAdjacentChild } from './complex/child-adjacent-child';
import { isInCompoundWithOneOtherElement } from './complex/is-in-compound';
import type { Container } from 'postcss-selector-parser';

export default function complexSelectors(selectors: string[], pluginOptions: { onComplexSelector?: 'warning' }, warnOnComplexSelector: () => void, warnOnPseudoElements: () => void) {
	return selectors.flatMap((selector) => {
		if (selector.indexOf(':-csstools-matches') === -1 && selector.toLowerCase().indexOf(':is') === -1) {
			return selector;
		}

		const selectorAST = parser().astSync(selector);
		selectorAST.walkPseudos((pseudo) => {
			// `:is()` -> `:not(*)`
			if (
				pseudo.value.toLowerCase() === ':is' &&
				pseudo.nodes &&
				pseudo.nodes.length &&
				pseudo.nodes[0].type === 'selector' &&
				pseudo.nodes[0].nodes.length === 0
			) {
				pseudo.value = ':not';
				pseudo.nodes[0].append(parser.universal());
				return;
			}

			if (pseudo.value !== ':-csstools-matches') {
				return;
			}

			if (pseudo.nodes && !pseudo.nodes.length) {
				pseudo.remove();
				return;
			}

			pseudo.walkPseudos((pseudoElement) => {
				if (parser.isPseudoElement(pseudoElement)) {
					let value = pseudoElement.value;
					if (value.startsWith('::-csstools-invalid-')) {
						// already invalidated and reported
						return;
					}

					while (value.startsWith(':')) {
						value = value.slice(1);
					}

					pseudoElement.value = `::-csstools-invalid-${value}`;
					warnOnPseudoElements();
				}
			});

			if (
				pseudo.nodes.length === 1 &&
				pseudo.nodes[0].type === 'selector'
			) {
				if (pseudo.nodes[0].nodes.length === 1) {
					pseudo.replaceWith(pseudo.nodes[0].nodes[0]);
					return;
				}

				if (!pseudo.nodes[0].some((x) => {
					return x.type === 'combinator';
				})) {
					pseudo.replaceWith(...pseudo.nodes[0].nodes);
					return;
				}
			}

			if (
				selectorAST.nodes.length === 1 &&
				selectorAST.nodes[0].type === 'selector' &&
				selectorAST.nodes[0].nodes.length === 1 &&
				selectorAST.nodes[0].nodes[0] === pseudo
			) {
				pseudo.replaceWith(...pseudo.nodes[0].nodes);
				return;
			}

			if (
				childAdjacentChild(pseudo.parent) ||
				isInCompoundWithOneOtherElement(pseudo.parent)
			) {
				return;
			}

			if (pluginOptions.onComplexSelector === 'warning') {
				warnOnComplexSelector();
			}

			pseudo.value = ':is';
		});

		selectorAST.walk((node) => {
			if (node.type !== 'selector' || !('nodes' in node)) {
				return;
			}

			if (
				node.nodes.length === 1 &&
				(node.nodes[0] as Container).type === 'selector'
			) {
				node.replaceWith(node.nodes[0]);
			}
		});

		selectorAST.walk((node) => {
			if ('nodes' in node) {
				sortCompoundSelectorsInsideComplexSelector(node);
			}
		});

		return selectorAST.toString();
	}).filter((x) => {
		return !!x;
	});
}
