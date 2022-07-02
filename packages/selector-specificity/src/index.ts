import parser from 'postcss-selector-parser';
import type { Node } from 'postcss-selector-parser';

export type Specificity = {
	a: number,
	b: number,
	c: number,
};

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
		c += 1;
	} else if (parser.isPseudoClass(node)) {
		switch (node.value.toLowerCase()) {
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
							return x.type === 'tag' && x.value.toLowerCase() === 'of';
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

export function compare(s1: Specificity, s2: Specificity): number {
	if (s1.a === s2.a) {
		if (s1.b === s2.b) {
			return s1.c - s2.c;
		}
		return s1.b - s2.b;
	}
	return s1.a - s2.a;
}
