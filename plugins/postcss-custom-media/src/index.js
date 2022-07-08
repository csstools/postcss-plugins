import getCustomMediaFromRoot from './custom-media-from-root';
import transformAtrules from './transform-atrules';

const creator = opts => {
	// whether to preserve custom media and at-rules using them
	const preserve = 'preserve' in Object(opts) ? Boolean(opts.preserve) : false;

	const customMediaHelperKey = Symbol('customMediaHelper');

	return {
		postcssPlugin: 'postcss-custom-media',
		Once: async (root, helpers) => {

			// combine rules from root and from imports
			helpers[customMediaHelperKey] = getCustomMediaFromRoot(root, { preserve });
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
