import parser from 'postcss-selector-parser';
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
			if (!rule.selector.includes(':has(')) {
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

function selectorSpecificity(node) {
	let a = 0;
	let b = 0;
	let c = 0;

	if (node.type == 'universal') {
		return {
			a: 0,
			b: 0,
			c: 0,
		};
	} else if (node.type === 'id') {
		a += 1;
	} else if (node.type === 'tag') {
		c += 1;
	} else if (node.type === 'class') {
		b += 1;
	} else if (node.type === 'attribute') {
		b += 1;
	} else if (node.type === 'pseudo' && node.value.indexOf('::') === 0) {
		c += 1;
	} else if (node.type === 'pseudo') {
		switch (node.value) {
			case ':after':
			case ':before':
				c += 1;
				break;

			case ':is':
			case ':has':
			case ':not':
			{
				if (node.nodes && node.nodes.length > 0) {
					let mostSpecificListItem = {
						a: 0,
						b: 0,
						c: 0,
					};

					node.nodes.forEach((child) => {
						const itemSpecificity = selectorSpecificity(child);
						if (itemSpecificity.a > mostSpecificListItem.a) {
							mostSpecificListItem = itemSpecificity;
							return;
						} else if (itemSpecificity.a < mostSpecificListItem.a) {
							return;
						}

						if (itemSpecificity.b > mostSpecificListItem.b) {
							mostSpecificListItem = itemSpecificity;
							return;
						} else if (itemSpecificity.b < mostSpecificListItem.b) {
							return;
						}

						if (itemSpecificity.c > mostSpecificListItem.c) {
							mostSpecificListItem = itemSpecificity;
							return;
						}
					});

					a += mostSpecificListItem.a;
					b += mostSpecificListItem.b;
					c += mostSpecificListItem.c;
				}
				break;
			}

			case 'where':
				break;

			case ':nth-child':
			case ':nth-last-child':
				{
					const ofSeparatorIndex = node.nodes.findIndex((x) => {
						x.value === 'of';
					});

					if (ofSeparatorIndex > -1) {
						const ofSpecificity = selectorSpecificity(parser.selector({ nodes: node.nodes.slice(ofSeparatorIndex + 1), value: '' }));
						a += ofSpecificity.a;
						b += ofSpecificity.b;
						c += ofSpecificity.c;
					} else {
						a += a;
						b += b;
						c += c;
					}
				}
				break;

			default:
				b += 1;
		}
	} else if (node.nodes && node.nodes.length > 0) {
		node.nodes.forEach((child) => {
			const specificity = selectorSpecificity(child);
			a += specificity.a;
			b += specificity.b;
			c += specificity.c;
		});
	}

	return {
		a,
		b,
		c,
	};
}

