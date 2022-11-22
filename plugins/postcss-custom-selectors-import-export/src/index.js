import getCustomSelectors from './custom-selectors-from-root';
import importCustomSelectorsFromSources from './import-from';
import exportCustomSelectorsToDestinations from './export-to';

const creator = (opts) => {
	// whether to preserve custom selectors and rules using them
	const preserve = Boolean(Object(opts).preserve);

	// sources to import custom selectors from
	const importFrom = [].concat(Object(opts).importFrom || []);

	// destinations to export custom selectors to
	const exportTo = [].concat(Object(opts).exportTo || []);

	// promise any custom selectors are imported
	const customSelectorsPromise = importCustomSelectorsFromSources(importFrom);

	return {
		postcssPlugin: 'postcss-custom-selectors-import-export',
		Once: async (root, { AtRule }) => {
			const importedSelectors = await customSelectorsPromise;

			const allCustomSelectors = Object.assign(
				{},
				importedSelectors,
				getCustomSelectors(root, { preserve }),
			);

			await exportCustomSelectorsToDestinations(allCustomSelectors, exportTo);

			if (importedSelectors) {
				const selectorNames = Object.keys(importedSelectors);
				selectorNames.reverse();

				const lastCustomSelector = root.nodes.find((node) => {
					return node.type === 'atrule' && node.name === 'custom-selector';
				});

				if (lastCustomSelector) {
					selectorNames.forEach((selectorName) => {
						lastCustomSelector.before(new AtRule({
							name: 'custom-selector',
							params: `${selectorName} ${importedSelectors[selectorName].toString()}`,
							source: {
								input: {
									from: root.input?.from ?? 'postcss-custom-selectors-import-export',
								},
								start: { line: 1, column: 1 },
								end: { line: 1, column: 1 },
							},
						}));
					});

					return;
				}

				selectorNames.forEach((selectorName) => {
					root.prepend(new AtRule({
						name: 'custom-selector',
						params: `${selectorName} ${importedSelectors[selectorName].toString()}`,
						source: {
							input: {
								from: root.input?.from ?? 'postcss-custom-selectors-import-export',
							},
							start: { line: 1, column: 1 },
							end: { line: 1, column: 1 },
						},
					}));
				});
			}
		},
	};
};

creator.postcss = true;

export default creator;
