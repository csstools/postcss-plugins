import parser from 'postcss-selector-parser';

const isPseudo = parser.pseudo({ value: ':is' });

export function wrapMultipleTagSelectorsWithIsPseudo(node) {
	// This is a fallback for broken selectors like:
	// `h1h2`
	// These selectors are also useless as `h1:is(h2)`.
	// Wrapping with is only prevents accidentally forming other words which might have meaning.

	const tagNodes = node.nodes.filter((x) => {
		return x.type === 'tag';
	});

	if (tagNodes.length > 1) {
		tagNodes.slice(1).forEach((child) => {
			const isPseudoClone = isPseudo.clone();
			child.replaceWith(isPseudoClone);
			isPseudoClone.append(child);
		});
	}
}
