import type { AtRule, Container, Document, Node, Plugin, PluginCreator } from 'postcss';
import parser from 'postcss-selector-parser';

/** postcss-scope-pseudo-class plugin options */
export type pluginOptions = {
	/** Preserve the original notation. default: false */
	preserve?: boolean,
};

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
		prepare(): Plugin {
			const transformedNodes = new WeakSet();

			return {
				postcssPlugin: 'postcss-scope-pseudo-class',
				Rule(rule, { result }): void {
					if (!rule.selector.toLowerCase().includes(':scope')) {
						return;
					}

					if (transformedNodes.has(rule)) {
						return;
					}

					{
						// We ignore rules withing `@scope`
						let parent: Container<Node> | Document | undefined = rule.parent;
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
						rule.warn(result, `Failed to parse selector : "${rule.selector}" with message: "${(err instanceof Error) ? err.message : err}"`);
					}

					if (modifiedSelector === rule.selector) {
						return;
					}

					transformedNodes.add(rule);
					rule.cloneBefore({
						selector: modifiedSelector,
					});

					if (!options.preserve) {
						rule.remove();
					}
				},
			};
		},
	};
};

creator.postcss = true;

export default creator;
export { creator as 'module.exports' };

