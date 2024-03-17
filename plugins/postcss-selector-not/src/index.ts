import type { PluginCreator } from 'postcss';
import parser from 'postcss-selector-parser';

function cleanupWhitespace(node: parser.Selector): void {
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

/** postcss-selector-not plugin options */
export type pluginOptions = Record<string, never>;

const creator: PluginCreator<pluginOptions> = () => {
	return {
		postcssPlugin: 'postcss-selector-not',
		Rule(rule, { result }): void {
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

					const replacements: Array<parser.Pseudo> = [];

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
			} catch (err) {
				rule.warn(result, `Failed to parse selector : "${rule.selector}" with message: "${(err instanceof Error) ? err.message : err}"`);
			}
		},
	};
};

creator.postcss = true;

export default creator;

