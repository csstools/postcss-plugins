import getCustomMediaFromRoot from './custom-media-from-root';
import getCustomMediaFromImports from './get-custom-media-from-imports';
import writeCustomMediaToExports from './write-custom-media-to-exports';

const creator = (opts) => {
	const importedStylesOverrideDocumentStyles = 'importedStylesOverrideDocumentStyles' in Object(opts) ? Boolean(opts.importedStylesOverrideDocumentStyles) : false;

	// sources to import custom media from
	const importFrom = [].concat(Object(opts).importFrom || []);

	// destinations to export custom selectors to
	const exportTo = [].concat(Object(opts).exportTo || []);

	// promise any custom media are imported
	const customMediaImportsPromise = getCustomMediaFromImports(importFrom);

	return {
		postcssPlugin: 'postcss-custom-media-import-export',
		Once: async (root, { result, postcss }) => {
			const importedMediaQueries = await customMediaImportsPromise;

			let allCustomMediaQueries;
			if (importedStylesOverrideDocumentStyles) {
				allCustomMediaQueries = Object.assign(
					{},
					getCustomMediaFromRoot(root),
					importedMediaQueries,
				);
			} else {
				allCustomMediaQueries = Object.assign(
					{},
					importedMediaQueries,
					getCustomMediaFromRoot(root),
				);
			}

			await writeCustomMediaToExports(allCustomMediaQueries, exportTo);

			if (importedMediaQueries) {
				const mediaQueryNames = Object.keys(importedMediaQueries);
				// Inserting in reverse order results in the correct order.
				mediaQueryNames.reverse();

				let operator = 'prepend';
				if (importedStylesOverrideDocumentStyles) {
					operator = 'append';
				}

				mediaQueryNames.forEach((mediaQueryName) => {
					root[operator](postcss.atRule({
						name: 'custom-media',
						params: `${mediaQueryName} ${importedMediaQueries[mediaQueryName].toString()}`,
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
