import getCustomMediaFromRoot from './lib/custom-media-from-root';
import getCustomMediaFromImports from './lib/get-custom-media-from-imports';
import transformAtrules from './lib/transform-atrules';
import writeCustomMediaToExports from './lib/write-custom-media-to-exports';

const creator = opts => {
	// whether to preserve custom media and at-rules using them
	const preserve = 'preserve' in Object(opts) ? Boolean(opts.preserve) : false;

	// sources to import custom media from
	const importFrom = [].concat(Object(opts).importFrom || []);

	// destinations to export custom media to
	const exportTo = [].concat(Object(opts).exportTo || []);

	// promise any custom media are imported
	const customMediaImportsPromise = getCustomMediaFromImports(importFrom);

	return {
		postcssPlugin: 'postcss-custom-media',
		Once: async (root, helpers) => {

			// combine rules from root and from imports
			helpers.customMedia = Object.assign(
				await customMediaImportsPromise,
				getCustomMediaFromRoot(root, { preserve })
			);

			await writeCustomMediaToExports(helpers.customMedia, exportTo);
		},
		AtRule: {
			media: (atrule, helpers) => {
				transformAtrules(atrule, {preserve}, helpers)
			}
		}
	}
}

creator.postcss = true

export default creator
