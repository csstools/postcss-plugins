// :-csstools-matches(.a > .b) > .c
// equivalent to
// .a > .b > .c

import type { Pseudo } from 'postcss-selector-parser';
import parser from 'postcss-selector-parser';

// because `:is()` is in the left-most compound selector
export function isPseudoInFirstCompound(selector: parser.Container): boolean {
	if (!selector || !selector.nodes) {
		return false;
	}

	if (!parser.isSelector(selector)) {
		return false;
	}

	let isPseudoIndex = -1;
	for (let i = 0; i < selector.nodes.length; i++) {
		const node = selector.nodes[i];
		if (parser.isCombinator(node)) {
			return false;
		}

		if (parser.isPseudoElement(node)) {
			return false;
		}

		if (parser.isPseudoClass(node)) {
			const nn = node as Pseudo; // because `isPseudoElement` is incorrectly typed

			if (nn.value === ':-csstools-matches') {
				if (!nn.nodes || nn.nodes.length !== 1) {
					return false;
				}

				isPseudoIndex = i;
				break;
			}
		}
	}

	if (isPseudoIndex === -1) {
		return false;
	}

	const isPseudo = selector.nodes[isPseudoIndex];
	if (!isPseudo || !parser.isPseudoClass(isPseudo)) {
		return false;
	}

	const before = selector.nodes.slice(0, isPseudoIndex);
	const after = selector.nodes.slice(isPseudoIndex + 1);

	before.forEach((node) => {
		isPseudo.nodes[0].append(node.clone());
	});

	after.forEach((node) => {
		isPseudo.nodes[0].append(node.clone());
	});

	isPseudo.replaceWith(...isPseudo.nodes);

	before.forEach((node) => {
		node.remove();
	});

	after.forEach((node) => {
		node.remove();
	});

	return true;
}
