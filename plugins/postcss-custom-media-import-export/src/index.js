import getCustomMediaFromRoot from './custom-media-from-root';
import getCustomMediaFromImports from './get-custom-media-from-imports';
import transformAtrules from './transform-atrules';
import writeCustomMediaToExports from './write-custom-media-to-exports';

const creator = opts => {
	// whether to preserve custom media and at-rules using them
	const preserve = 'preserve' in Object(opts) ? Boolean(opts.preserve) : false;

	// sources to import custom media from
	const importFrom = [].concat(Object(opts).importFrom || []);


	// destinations to export custom media to
	const exportTo = [].concat(Object(opts).exportTo || []);

	// promise any custom media are imported
	const customMediaImportsPromise = getCustomMediaFromImports(importFrom);

	const customMediaHelperKey = Symbol('customMediaHelper');

	return {
		postcssPlugin: 'postcss-custom-media',
		Once: async (root, helpers) => {

			// combine rules from root and from imports
			helpers[customMediaHelperKey] = Object.assign(
				await customMediaImportsPromise,
				getCustomMediaFromRoot(root, { preserve }),
			);

			await writeCustomMediaToExports(helpers[customMediaHelperKey], exportTo);
		},
		AtRule: (atrule, helpers) => {
			if (atrule.name !== 'media') {
				return;
			}

			transformAtrules(atrule, helpers[customMediaHelperKey], { preserve });
		},
	};
};

creator.postcss = true;

export default creator;
