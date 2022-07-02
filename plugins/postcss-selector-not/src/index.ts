import type { PluginCreator } from 'postcss';
import parser from 'postcss-selector-parser';

function cleanupWhitespace(node) {
	if (node.spaces) {
		node.spaces.after = '';
		node.spaces.before = '';
	}

	if (node.nodes && node.nodes.length > 0) {
		if (node.nodes[0] && node.nodes[0].spaces) {
			node.nodes[0].spaces.before = '';
		}

		if (
			node.nodes[node.nodes.length - 1] &&
			node.nodes[node.nodes.length - 1].spaces
		) {
			node.nodes[node.nodes.length - 1].spaces.after = '';
		}
	}
}

const creator: PluginCreator<never> = () => {
	return {
		postcssPlugin: 'postcss-selector-not',
		Rule: (rule, { result }) => {
			if (!rule.selector || !rule.selector.toLowerCase().includes(':not(')) {
				return;
			}

			try {
				const selectorAST = parser().astSync(rule.selector);
				selectorAST.walkPseudos((pseudo) => {
					if (pseudo.value.toLowerCase() !== ':not') {
						return;
					}

					if (!pseudo.nodes || pseudo.nodes.length < 2) {
						return;
					}

					const replacements = [];

					pseudo.nodes.forEach((node) => {
						cleanupWhitespace(node);

						// Wrap each child selector in it's own `:not()`
						const newPseudo = parser.pseudo({
							value: ':not',
							nodes: [node],
						});
						replacements.push(newPseudo);
					});

					// Replace the pseudo with the list of new pseudos
					pseudo.replaceWith(...replacements);
				});

				const modifiedSelector = selectorAST.toString();
				if (modifiedSelector !== rule.selector) {
					rule.replaceWith(rule.clone({selector: modifiedSelector}));
				}
			} catch (_) {
				rule.warn(
					result,
					`Failed to parse selector "${rule.selector}"`,
				);
			}
		},
	};
};

creator.postcss = true;

export default creator;

