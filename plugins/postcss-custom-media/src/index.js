import getCustomMediaFromRoot from './custom-media-from-root';
import transformAtRules from './transform-atrules';

const creator = opts => {
	// whether to preserve custom media and at-rules using them
	const preserve = 'preserve' in Object(opts) ? Boolean(opts.preserve) : false;

	return {
		postcssPlugin: 'postcss-custom-media',
		prepare() {
			let customMedia = new Map();

			return {
				Once: (root) => {
					// combine rules from root and from imports
					customMedia = getCustomMediaFromRoot(root, { preserve: preserve });
				},
				AtRule: (atrule) => {
					if (atrule.name.toLowerCase() !== 'media') {
						return;
					}

					transformAtRules(atrule, customMedia, { preserve: preserve });
				},
			};
		},
	};
};

creator.postcss = true;

export default creator;
