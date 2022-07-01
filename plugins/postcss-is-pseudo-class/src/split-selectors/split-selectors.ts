import parser from 'postcss-selector-parser';
import { selectorSpecificity } from '@csstools/selector-specificity';

// splitSelectors handles the forgiving list behavior of ":is".
// After created all combinations it wraps the individual selectors in ":-csstools-matches".
// This makes it easy to recursively resolve all ":is" selectors without infinite loops.
export default function splitSelectors(selectors: string[], pluginOptions: { specificityMatchingName: string }, recursionDepth = 0) {
	const specificityMatchingNameId = ':not(#' + pluginOptions.specificityMatchingName + ')';
	const specificityMatchingNameClass = ':not(.' + pluginOptions.specificityMatchingName + ')';
	const specificityMatchingNameTag = ':not(' + pluginOptions.specificityMatchingName + ')';

	return selectors.flatMap((selector) => {
		if (selector.toLowerCase().indexOf(':is') === -1) {
			return selector;
		}

		let foundNestedIs = false;
		const replacements = [];

		const selectorAST = parser().astSync(selector);
		selectorAST.walkPseudos((pseudo) => {
			if (pseudo.value.toLowerCase() !== ':is' || !pseudo.nodes || !pseudo.nodes.length) {
				return;
			}

			if (pseudo.nodes[0].type === 'selector' && pseudo.nodes[0].nodes.length === 0) {
				return;
			}

			let parent = pseudo.parent;
			while (parent) {
				if (parent.value && parent.value.toLowerCase() === ':is' && parent.type === 'pseudo') {
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

		let results = [];
		cartesianProduct(...replacements).forEach((replacement) => {
			let result = '';

			for (let i = 0; i < replacement.length; i++) {
				const options = replacement[i];

				result += selector.substring(replacement[i - 1]?.end || 0, replacement[i].start);
				result += ':-csstools-matches(' + options.option + ')';

				if (i === replacement.length - 1) {
					result += selector.substring(replacement[i].end);
				}
			}

			results.push(result);
		});

		if (foundNestedIs && recursionDepth < 10) {
			// recursion to transform `:is(a :is(b,c))`
			results = splitSelectors(results, pluginOptions, recursionDepth + 1);
		}

		return results;
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
