import type { AtRule, Container, Node, PluginCreator } from 'postcss';
import parser from 'postcss-selector-parser';

type pluginOptions = { preserve?: boolean };

const creator: PluginCreator<pluginOptions> = (opts?: pluginOptions) => {
	const options = Object.assign(
		// Default options
		{
			preserve: false,
		},
		// Provided options
		opts,
	);

	return {
		postcssPlugin: 'postcss-scope-pseudo-class',
		Rule(rule, { result }) {
			if (!rule.selector.toLowerCase().includes(':scope')) {
				return;
			}

			{
				// We ignore rules withing `@scope`
				let parent: Container<Node> = rule.parent;
				while (parent) {
					if (parent.type === 'atrule' && (parent as AtRule).name.toLowerCase() === 'scope') {
						return;
					}

					parent = parent.parent;
				}
			}

			let modifiedSelector = rule.selector;
			try {
				const selectorAST = parser().astSync(modifiedSelector);
				if (!selectorAST) {
					return;
				}

				selectorAST.walkPseudos((pseudo) => {
					if (pseudo.value.toLowerCase() === ':has') {
						return false;
					}

					if (pseudo.value.toLowerCase() === ':scope') {
						pseudo.value = ':root';
					}
				});

				modifiedSelector = selectorAST.toString();
			} catch (err) {
				rule.warn(result, `Unable to parse selector: "${rule.selector}"`);
			}

			if (modifiedSelector === rule.selector) {
				return;
			}

			rule.cloneBefore({
				selector: modifiedSelector,
			});

			if (!options.preserve) {
				rule.remove();
			}
		},
	};
};

creator.postcss = true;

export default creator;

