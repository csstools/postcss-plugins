import parser from 'postcss-selector-parser';
import type { Node, Selector } from 'postcss-selector-parser';

/**
 * The specificity of a selector
 */
export type Specificity = {
	/**
	 * The number of ID selectors in the selector
	 */
	a: number,
	/**
	 * The number of class selectors, attribute selectors, and pseudo-classes in the selector
	 */
	b: number,
	/**
	 * The number of type selectors and pseudo-elements in the selector
	 */
	c: number,
};

/**
 * Options for the calculation of the specificity of a selector
 */
export type CalculationOptions = {
	/**
	 * The callback to calculate a custom specificity for a node
	 */
	customSpecificity?: CustomSpecificityCallback,
};

/**
 * Calculate a custom specificity for a node
 */
export type CustomSpecificityCallback = (node: Node) => Specificity | void | false | null | undefined;

/**
 * Compare two specificities
 * @param s1 The first specificity
 * @param s2 The second specificity
 * @returns A value smaller than `0` if `s1` is less specific than `s2`, `0` if `s1` is equally specific as `s2`, a value larger than `0` if `s1` is more specific than `s2`
 */
export function compare(s1: Specificity, s2: Specificity): number {
	if (s1.a === s2.a) {
		if (s1.b === s2.b) {
			return s1.c - s2.c;
		}
		return s1.b - s2.b;
	}
	return s1.a - s2.a;
}

/**
 * Calculate the specificity for a selector
 */
export function selectorSpecificity(node: Node, options?: CalculationOptions): Specificity {
	const customSpecificity = options?.customSpecificity?.(node);
	if (customSpecificity) {
		return customSpecificity;
	}

	// https://www.w3.org/TR/selectors-4/#specificity-rules

	if (!node) {
		return {
			a: 0,
			b: 0,
			c: 0,
		};
	}

	let a = 0; /* ID Selectors */
	let b = 0; /* Class, Attribute, and Pseudo-class selectors */
	let c = 0; /* Type selectors and Pseudo-elements */

	if (node.type === 'universal') {
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
	} else if (isPseudoElement(node)) {
		node = node as parser.Pseudo;

		switch (node.value.toLowerCase()) {
			case '::slotted':
				// “The specificity of ::slotted() is that of a pseudo-element, plus the specificity of its argument.”

				{
					c += 1;

					if (node.nodes && node.nodes.length > 0) {
						// We are more forgiving than the specification and use the most specific complex selector.
						// This gives the community more options to do non-standard things.
						//
						// This code is correct for correct CSS.
						// It is only different for invalid CSS.
						const mostSpecificListItem = specificityOfMostSpecificListItem(node.nodes, options);

						a += mostSpecificListItem.a;
						b += mostSpecificListItem.b;
						c += mostSpecificListItem.c;
					}
				}

				break;

			case '::view-transition-group':
			case '::view-transition-image-pair':
			case '::view-transition-old':
			case '::view-transition-new':
				// https://drafts.csswg.org/css-view-transitions-1/#named-view-transition-pseudo

				if (
					node.nodes &&
					node.nodes.length === 1 &&
					node.nodes[0].type === 'selector' &&
					selectorNodeContainsNothingOrOnlyUniversal(node.nodes[0])
				) {
					return {
						a: 0,
						b: 0,
						c: 0,
					};
				}

				return {
					a: 0,
					b: 0,
					c: 1,
				};

			default:
				c += 1;

				break;
		}

	} else if (parser.isPseudoClass(node)) {
		switch (node.value.toLowerCase()) {
			// The specificity of :any() and :-webkit-any() as implemented in browsers is 1 no matter the content.
			case ':-webkit-any':
			case ':any':
				b += 1;
				break;

			case ':-moz-any':
			case ':has':
			case ':is':
			case ':matches':
			case ':not':

			// The specificity of an :is(), :-moz-any(), :not(), or :has() pseudo-class is replaced by the specificity of the most specific complex selector in its selector list argument.
			{
				if (node.nodes && node.nodes.length > 0) {
					const mostSpecificListItem = specificityOfMostSpecificListItem(node.nodes, options);

					a += mostSpecificListItem.a;
					b += mostSpecificListItem.b;
					c += mostSpecificListItem.c;
				}

				break;
			}

			case ':where':
				// The specificity of a :where() pseudo-class is replaced by zero.
				break;

			case ':nth-child':
			case ':nth-last-child':

				// The specificity of an :nth-child() or :nth-last-child() selector is the specificity of the pseudo class itself (counting as one pseudo-class selector) plus the specificity of the most specific complex selector in its selector list argument.
				{
					b += 1;

					if (node.nodes && node.nodes.length > 0) {
						const ofSeparatorIndex = node.nodes[0].nodes.findIndex((x) => {
							return x.type === 'tag' && x.value.toLowerCase() === 'of';
						});

						if (ofSeparatorIndex > -1) {
							const selector = parser.selector({
								nodes: [],
								value: '',
							});

							node.nodes[0].nodes.slice(ofSeparatorIndex + 1).forEach((child) => {
								selector.append(child.clone());
							});

							const selectorList = [selector];
							if (node.nodes.length > 1) {
								selectorList.push(...node.nodes.slice(1));
							}

							const mostSpecificListItem = specificityOfMostSpecificListItem(selectorList, options);

							a += mostSpecificListItem.a;
							b += mostSpecificListItem.b;
							c += mostSpecificListItem.c;
						}
					}
				}

				break;

			case ':local':
			case ':global':
				// see : https://github.com/css-modules/css-modules
				if (node.nodes && node.nodes.length > 0) {
					node.nodes.forEach((child) => {
						const specificity = selectorSpecificity(child, options);
						a += specificity.a;
						b += specificity.b;
						c += specificity.c;
					});
				}

				break;

			case ':host':
			case ':host-context':
				// The specificity of :host() is that of a pseudo-class, plus the specificity of its argument.
				// The specificity of :host-context() is that of a pseudo-class, plus the specificity of its argument.

				{
					b += 1;

					if (node.nodes && node.nodes.length > 0) {
						const mostSpecificListItem = specificityOfMostSpecificListItem(node.nodes, options);

						// We are more forgiving than the specification and use the most specific complex selector.
						// This gives the community more options to do non-standard things.
						//
						// This code is correct for correct CSS.
						// It is only different for invalid CSS.
						a += mostSpecificListItem.a;
						b += mostSpecificListItem.b;
						c += mostSpecificListItem.c;
					}
				}

				break;
			case ':active-view-transition':
				// see : https://drafts.csswg.org/css-view-transitions-2/#the-active-view-transition-pseudo
				return {
					a: 0,
					b: 1,
					c: 0,
				};
			case ':active-view-transition-type':
				// see : https://drafts.csswg.org/css-view-transitions-2/#the-active-view-transition-type-pseudo
				return {
					a: 0,
					b: 1,
					c: 0,
				};

			default:
				b += 1;
		}
	} else if ((parser.isContainer(node)) && node.nodes?.length > 0) {
		node.nodes.forEach((child) => {
			const specificity = selectorSpecificity(child, options);
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

/**
 * Calculate the most specific selector in a list
 */
export function specificityOfMostSpecificListItem(nodes: Array<Node>, options?: CalculationOptions): { a: number, b: number, c: number } {
	let mostSpecificListItem = {
		a: 0,
		b: 0,
		c: 0,
	};

	nodes.forEach((child) => {
		const itemSpecificity = selectorSpecificity(child, options);
		if (compare(itemSpecificity, mostSpecificListItem) < 0) {
			return;
		}

		mostSpecificListItem = itemSpecificity;
	});

	return mostSpecificListItem;
}

function isPseudoElement(node: Node): boolean {
	// Typescript definition of "isPseudoElement" is incorrect.
	// This function removes the magic and is a simple boolean check.
	return parser.isPseudoElement(node);
}

function selectorNodeContainsNothingOrOnlyUniversal(node: Selector): boolean {
	if (!node) {
		return false;
	}

	if (!node.nodes) {
		return false;
	}

	const relevantNodes = node.nodes.filter((x) => {
		return x.type !== 'comment';
	});

	if (relevantNodes.length === 0) {
		return true;
	}

	if (relevantNodes.length !== 1) {
		return false;
	}

	return relevantNodes[0].type === 'universal';
}
