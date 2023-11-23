import parser from 'postcss-selector-parser';
import type { Node, Selector } from 'postcss-selector-parser';
import { toLowerCaseAZ } from './to-lower-case-a-z';

export type Specificity = {
	a: number,
	b: number,
	c: number,
};

export function compare(s1: Specificity, s2: Specificity): number {
	if (s1.a === s2.a) {
		if (s1.b === s2.b) {
			return s1.c - s2.c;
		}
		return s1.b - s2.b;
	}
	return s1.a - s2.a;
}

export function selectorSpecificity(node: Node): Specificity {
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
	} else if (isPseudoElement(node)) {
		node = node as parser.Pseudo;

		switch (toLowerCaseAZ(node.value)) {
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
						const mostSpecificListItem = specificityOfMostSpecificListItem(node.nodes);

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
					selectorNodeContainsOnlyUniversal(node.nodes[0])
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
		switch (toLowerCaseAZ(node.value)) {
			case ':-moz-any':
			case ':-webkit-any':
			case ':any':
			case ':has':
			case ':is':
			case ':matches':
			case ':not':

			// The specificity of an :is(), :not(), or :has() pseudo-class is replaced by the specificity of the most specific complex selector in its selector list argument.
			{
				if (node.nodes && node.nodes.length > 0) {
					const mostSpecificListItem = specificityOfMostSpecificListItem(node.nodes);

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
							return x.type === 'tag' && toLowerCaseAZ(x.value) === 'of';
						});

						if (ofSeparatorIndex > -1) {
							const subSelector = [
								parser.selector({
									nodes: node.nodes[0].nodes.slice(ofSeparatorIndex + 1),
									value: '',
								}),
							];

							if (node.nodes.length > 1) {
								subSelector.push(...node.nodes.slice(1));
							}

							const mostSpecificListItem = specificityOfMostSpecificListItem(subSelector);

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
						const specificity = selectorSpecificity(child);
						a += specificity.a;
						b += specificity.b;
						c += specificity.c;
					});
				}

				break;

			case ':host':
			case ':host-context':
				// “The specificity of :host is that of a pseudo-class. The specificity of :host() is that of a pseudo-class, plus the specificity of its argument.”
				// “The specificity of :host-context() is that of a pseudo-class, plus the specificity of its argument.”

				{
					b += 1;

					if (node.nodes && node.nodes.length > 0) {
						const mostSpecificListItem = specificityOfMostSpecificListItem(node.nodes);

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

				if (
					node.nodes &&
							node.nodes.length === 1 &&
							node.nodes[0].type === 'selector' &&
							selectorNodeContainsOnlyUniversal(node.nodes[0])
				) {
					return {
						a: 0,
						b: 1,
						c: 0,
					};
				}

				return {
					a: 0,
					b: 2,
					c: 0,
				};

			default:
				b += 1;
		}
	} else if ((parser.isContainer(node)) && node.nodes.length > 0) {
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

function specificityOfMostSpecificListItem(nodes: Array<Node>) {
	let mostSpecificListItem = {
		a: 0,
		b: 0,
		c: 0,
	};

	nodes.forEach((child) => {
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

	return mostSpecificListItem;
}

function isPseudoElement(node: Node): boolean {
	// Typescript definition of "isPseudoElement" is incorrect.
	// This function removes the magic and is a simple boolean check.
	return parser.isPseudoElement(node);
}

function selectorNodeContainsOnlyUniversal(node: Selector): boolean {
	if (!node) {
		return false;
	}

	if (!node.nodes) {
		return false;
	}

	const relevantNodes = node.nodes.filter((x) => {
		return x.type !== 'comment';
	});

	if (relevantNodes.length !== 1) {
		return false;
	}

	return relevantNodes[0].type === 'universal';
}
