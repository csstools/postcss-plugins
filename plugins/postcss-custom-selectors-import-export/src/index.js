import getCustomSelectors from './custom-selectors-from-root';
import importCustomSelectorsFromSources from './import-from';
import exportCustomSelectorsToDestinations from './export-to';

const creator = (opts) => {
	const importedStylesOverrideDocumentStyles = 'importedStylesOverrideDocumentStyles' in Object(opts) ? Boolean(opts.importedStylesOverrideDocumentStyles) : false;

	// sources to import custom selectors from
	const importFrom = [].concat(Object(opts).importFrom || []);

	// destinations to export custom selectors to
	const exportTo = [].concat(Object(opts).exportTo || []);

	// promise any custom selectors are imported
	const customSelectorsPromise = importCustomSelectorsFromSources(importFrom);

	return {
		postcssPlugin: 'postcss-custom-selectors-import-export',
		Once: async (root, { result, postcss }) => {
			const importedSelectors = await customSelectorsPromise;

			let allCustomSelectors;
			if (importedStylesOverrideDocumentStyles) {
				allCustomSelectors = Object.assign(
					{},
					getCustomSelectors(root),
					importedSelectors,
				);
			} else {
				allCustomSelectors = Object.assign(
					{},
					importedSelectors,
					getCustomSelectors(root),
				);
			}

			await exportCustomSelectorsToDestinations(allCustomSelectors, exportTo);

			if (importedSelectors) {
				const selectorNames = Object.keys(importedSelectors);
				// Inserting in reverse order results in the correct order.
				selectorNames.reverse();

				let operator = 'prepend';
				if (importedStylesOverrideDocumentStyles) {
					operator = 'append';
				}

				selectorNames.forEach((selectorName) => {
					root[operator](postcss.atRule({
						name: 'custom-selector',
						params: `${selectorName} ${importedSelectors[selectorName].toString()}`,
						source: {
							input: {
								from: result.opts.from,
							},
							start: { offset: 0, line: 1, column: 1 },
							end: { offset: 0, line: 1, column: 1 },
						},
					}));
				});
			}
		},
	};
};

creator.postcss = true;

export default creator;
