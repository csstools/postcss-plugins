import parser from 'postcss-selector-parser';
import { selectorSpecificity } from './specificity';
import { sortCompoundSelectorsInsideComplexSelector } from './compound-selector-order';

export default function splitSelectors(selectors) {
	const doesNotExistName = 'does-not-exist';
	const doesNotExistId = ':not(#' + doesNotExistName + ')';
	const doesNotExistClass = ':not(.' + doesNotExistName + ')';
	const doesNotExistTag = ':not(' + doesNotExistName + ')';

	return selectors.flatMap((selector) => {
		process.stdout.write(JSON.stringify(selector, null, 2) + '\n');
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
					option: ':unreplaced',
				};

				const childSpecificity = selectorSpecificity(child);
				let childCSS = child.toString().trim();

				const aSpecificityCorrection = Math.max(0, specificity.a - childSpecificity.a);
				const bSpecificityCorrection = Math.max(0, specificity.b - childSpecificity.b);
				const cSpecificityCorrection = Math.max(0, specificity.c - childSpecificity.c);

				for (let i = 0; i < aSpecificityCorrection; i++) {
					childCSS += doesNotExistId;
				}
				for (let i = 0; i < bSpecificityCorrection; i++) {
					childCSS += doesNotExistClass;
				}
				for (let i = 0; i < cSpecificityCorrection; i++) {
					childCSS += doesNotExistTag;
				}

				replacement.option = childCSS;
				replacementsParts.push(replacement);
			});

			replacements.push(replacementsParts);
		});

		const results = [];
		cartesian(...replacements).forEach((replacement) => {
			let result = '';

			for (let i = 0; i < replacement.length; i++) {
				const options = replacement[i];

				if (i === 0) {
					result += selector.substring(0, replacement[i].start);
					result += ':is(' + options.option + ')';
					continue;
				}

				result += selector.substring(replacement[i - 1].end, replacement[i].start);
				result += ':is(' + options.option + ')';

				if (i === replacement.length - 1) {
					result += selector.substring(replacement[i].end);
				}
			}

			results.push(result);
		});

		let formattedResults = results.map((x) => {
			const modifiedSelectorAST = parser().astSync(x);
			modifiedSelectorAST.walkPseudos((pseudo) => {
				if (pseudo.value !== ':is' || !pseudo.nodes || pseudo.nodes.length !== 1) {
					return;
				}

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

		if (foundNestedIs) {
			formattedResults = splitSelectors(formattedResults);
		}

		return formattedResults;
	});
}

function cartesian(...args) {
	const r = [], max = args.length - 1;
	function helper(arr, i) {
		for (let j = 0, l = args[i].length; j < l; j++) {
			const a = arr.slice(0); // clone arr
			a.push(args[i][j]);
			if (i == max)
				r.push(a);
			else
				helper(a, i + 1);
		}
	}
	helper([], 0);
	return r;
}
