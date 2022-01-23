import parser from 'postcss-selector-parser';
import { selectorSpecificity } from './specificity';
import { sortCompoundSelectorsInsideComplexSelector } from './compound-selector-order';
import { childAdjacentChild } from './complex/child-adjacent-child';
import { isInCompoundWithOneOtherElement } from './complex/is-in-compound';

export default function splitSelectors(selectors: string[], pluginOptions: { preserve?: boolean, onComplexSelector?: 'warning' | 'skip', specificityMatchingName: string }, warnFn: () => void, recursionDepth = 0) {
	const specificityMatchingNameId = ':not(#' + pluginOptions.specificityMatchingName + ')';
	const specificityMatchingNameClass = ':not(.' + pluginOptions.specificityMatchingName + ')';
	const specificityMatchingNameTag = ':not(' + pluginOptions.specificityMatchingName + ')';

	return selectors.flatMap((selector) => {
		if (selector.indexOf(':is') === -1) {
			return selector;
		}

		let foundNestedIs = false;
		const replacements = [];

		const selectorAST = parser().astSync(selector);
		selectorAST.walkPseudos((pseudo) => {
			if (pseudo.value !== ':is' || !pseudo.nodes || !pseudo.nodes.length) {
				return;
			}

			let parent = pseudo.parent;
			while (parent) {
				if (parent.value === ':is' && parent.type === 'pseudo') {
					foundNestedIs = true;
					return;
				}

				parent = parent.parent;
			}

			const specificity = selectorSpecificity(pseudo);
			const start = pseudo.sourceIndex;
			const end = start + pseudo.toString().length;

			const replacementsParts = [];

			pseudo.nodes.forEach((child) => {
				const replacement = {
					start: start,
					end: end,
					option: '',
				};

				const childSpecificity = selectorSpecificity(child);
				let childCSS = child.toString().trim();

				const aSpecificityCorrection = Math.max(0, specificity.a - childSpecificity.a);
				const bSpecificityCorrection = Math.max(0, specificity.b - childSpecificity.b);
				const cSpecificityCorrection = Math.max(0, specificity.c - childSpecificity.c);

				for (let i = 0; i < aSpecificityCorrection; i++) {
					childCSS += specificityMatchingNameId;
				}
				for (let i = 0; i < bSpecificityCorrection; i++) {
					childCSS += specificityMatchingNameClass;
				}
				for (let i = 0; i < cSpecificityCorrection; i++) {
					childCSS += specificityMatchingNameTag;
				}

				replacement.option = childCSS;
				replacementsParts.push(replacement);
			});

			replacements.push(replacementsParts);
		});

		if (!replacements.length) {
			return [selector];
		}

		const results = [];
		cartesianProduct(...replacements).forEach((replacement) => {
			let result = '';

			for (let i = 0; i < replacement.length; i++) {
				const options = replacement[i];

				result += selector.substring(replacement[i - 1]?.end || 0, replacement[i].start);
				result += ':is(' + options.option + ')';

				if (i === replacement.length - 1) {
					result += selector.substring(replacement[i].end);
				}
			}

			results.push(result);
		});

		let hasComplexSelectors = false;
		let formattedResults = results.map((x) => {
			const modifiedSelectorAST = parser().astSync(x);

			// Handle complex selector cases
			modifiedSelectorAST.walk((node) => {
				// "childAdjacentChild" returns true|false
				// future transforms can be chained with "||" operators.
				childAdjacentChild(node) ||
					isInCompoundWithOneOtherElement(node);
			});

			// Remove `:is` with single elements
			modifiedSelectorAST.walkPseudos((pseudo) => {
				if (pseudo.value !== ':is' || !pseudo.nodes || pseudo.nodes.length !== 1) {
					return;
				}

				if (pseudo.nodes[0].type === 'selector' && pseudo.nodes[0].nodes.length !== 1 && pseudo.nodes[0].some((y) => y.type === 'combinator')) {
					return;
				}

				// Warn when `:is` contains a complex selector.
				pseudo.nodes.forEach((child) => {
					if (child.some((grandChild) => grandChild.type === 'combinator')) {
						warnFn();
						hasComplexSelectors = true;
					}
				});

				pseudo.replaceWith(pseudo.nodes[0]);
			});

			modifiedSelectorAST.walk((node) => {
				if ('nodes' in node) {
					node.nodes.forEach((child) => {
						sortCompoundSelectorsInsideComplexSelector(child);
					});
					sortCompoundSelectorsInsideComplexSelector(node);
				}
			});

			return modifiedSelectorAST.toString();
		});

		if (pluginOptions.onComplexSelector === 'skip' && hasComplexSelectors) {
			return [selector];
		}

		if (foundNestedIs && recursionDepth < 10) {
			// recursion to transform `:is(a :is(b,c))`
			formattedResults = splitSelectors(formattedResults, pluginOptions, warnFn, recursionDepth + 1);
		}

		return formattedResults;
	}).filter((x) => {
		return !!x;
	});
}

// https://en.wikipedia.org/wiki/Cartesian_product
function cartesianProduct(...args) {
	const r = [];
	const max = args.length - 1;

	function helper(arr, i) {
		for (let j = 0, l = args[i].length; j < l; j++) {
			const a = arr.slice(0);
			a.push(args[i][j]);
			if (i == max) {
				r.push(a);
			} else {
				helper(a, i + 1);
			}
		}
	}
	helper([], 0);
	return r;
}
