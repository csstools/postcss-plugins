import parser from 'postcss-selector-parser';

const isPseudo = parser.pseudo({ value: ':is' });

export function wrapMultipleTagSelectorsWithIsPseudo(node) {
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
