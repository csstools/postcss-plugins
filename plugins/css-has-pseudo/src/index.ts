import parser from 'postcss-selector-parser';
import { selectorSpecificity } from '@csstools/selector-specificity';
import encodeCSS from './encode/encode.mjs';
import type { PluginCreator } from 'postcss';

const creator: PluginCreator<{ preserve?: boolean, specificityMatchingName?: string }> = (opts?: { preserve?: boolean, specificityMatchingName?: string }) => {
	const options = {
		preserve: true,
		specificityMatchingName: 'does-not-exist',
		...(opts || {}),
	};

	const specificityMatchingNameId = ':not(#' + options.specificityMatchingName + ')';
	const specificityMatchingNameClass = ':not(.' + options.specificityMatchingName + ')';
	const specificityMatchingNameTag = ':not(' + options.specificityMatchingName + ')';

	return {
		postcssPlugin: 'css-has-pseudo-experimental',
		RuleExit: (rule, { result }) => {
			if (!rule.selector.includes(':has(') || isWithinSupportCheck(rule)) {
				return;
			}

			const selectors = rule.selectors.map((selector) => {
				if (!selector.includes(':has(')) {
					return selector;
				}

				let selectorAST;
				try {
					selectorAST = parser().astSync(selector);
				} catch (_) {
					rule.warn(result, `Failed to parse selector : ${selector}`);
					return selector;
				}

				if (typeof selectorAST === 'undefined') {
					return selector;
				}

				let containsHasPseudo = false;
				selectorAST.walkPseudos((node) => {
					containsHasPseudo = containsHasPseudo || (node.value === ':has' && node.nodes);

					// see : https://bugs.chromium.org/p/chromium/issues/detail?id=669058#c34
					// When we have ':has(:visited) {...}', the subject elements of the rule
					// are the ancestors of the visited link element.

					// To prevent leaking visitedness to the link's ancestors, the ':visited'
					// selector does not match if it is inside the ':has()' argument selector.
					// So if a ':has()' argument selector requires a matching ':visited', the
					// style rule are not applied.
					if (node.value === ':visited') {
						// We can't leave `:has` untouched as that might cause broken selector lists.
						// Replacing with the specificity matching name as this should never match anything without `:not()`.
						node.replaceWith(parser.className({
							value: options.specificityMatchingName,
						}));
					}

					if (node.value === ':any-link') {
						// we can transform `:any-link` to `:link` as this is allowed
						node.value = ':link';
					}
				});

				if (!containsHasPseudo) {
					return selector;
				}

				const encodedSelector = '[' + encodeCSS(selectorAST.toString()) + ']';
				const abcSpecificity = selectorSpecificity(selectorAST);

				let encodedSelectorWithSpecificity = encodedSelector;
				for (let i = 0; i < abcSpecificity.a; i++) {
					encodedSelectorWithSpecificity += specificityMatchingNameId;
				}
				const bSpecificity = Math.max(1, abcSpecificity.b) - 1;
				for (let i = 0; i < bSpecificity; i++) {
					encodedSelectorWithSpecificity += specificityMatchingNameClass;
				}
				for (let i = 0; i < abcSpecificity.c; i++) {
					encodedSelectorWithSpecificity += specificityMatchingNameTag;
				}

				return encodedSelectorWithSpecificity;
			});

			if (selectors.join(',') === rule.selectors.join(',')) {
				return;
			}

			if (options.preserve) {
				rule.cloneBefore({ selectors: selectors });
			} else {
				rule.selectors = selectors;
			}
		},
	};
};

creator.postcss = true;

export default creator;

function isWithinSupportCheck(rule) {
	let isSupportCheck = false;
	let ruleParent = rule.parent;

	while (!isSupportCheck && ruleParent) {
		if (ruleParent.type === 'atrule') {

			isSupportCheck = ruleParent.params.includes(':has(') && ruleParent.params.startsWith('selector(');
		}

		ruleParent = ruleParent.parent;
	}

	return isSupportCheck;
}
