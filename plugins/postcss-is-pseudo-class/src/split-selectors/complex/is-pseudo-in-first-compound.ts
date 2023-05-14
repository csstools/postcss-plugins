// :-csstools-matches(.a > .b) > .c
// equivalent to
// .a > .b > .c
// because `:is()` is in the left-most compound selector
export function isPseudoInFirstCompound(selector): boolean {
	if (!selector || !selector.nodes) {
		return false;
	}
	if (selector.type !== 'selector') {
		return false;
	}

	let isPseudoIndex = -1;
	for (let i = 0; i < selector.nodes.length; i++) {
		const node = selector.nodes[i];
		if (node.type === 'combinator') {
			return false;
		}

		if (node.type === 'pseudo' && node.value === ':-csstools-matches') {
			if (!node.nodes || node.nodes.length !== 1) {
				return false;
			}

			isPseudoIndex = i;
			break;
		}
	}

	if (isPseudoIndex === -1) {
		return false;
	}

	const before = selector.nodes.slice(0, isPseudoIndex);
	const isPseudo = selector.nodes[isPseudoIndex];
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
