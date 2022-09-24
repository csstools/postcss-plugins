import type { PluginCreator } from 'postcss';
import getCustomMedia from './custom-media-from-root';
import { transformAtMediaListTokens } from './transform-at-media';

export interface PluginOptions {
	/** Determines whether Custom Media and media queries using custom media should be preserved in their original form. */
	preserve?: boolean
}

const creator: PluginCreator<PluginOptions> = (opts?: PluginOptions) => {
	// whether to preserve custom media and rules using them
	const preserve = Boolean(Object(opts).preserve);

	if ('importFrom' in Object(opts)) {
		throw new Error('[postcss-custom-media] "importFrom" is no longer supported');
	}

	if ('exportTo' in Object(opts)) {
		throw new Error('[postcss-custom-media] "exportTo" is no longer supported');
	}

	return {
		postcssPlugin: 'postcss-custom-media',
		prepare() {
			let customMedia = new Map();

			return {
				Once: (root) => {
					customMedia = getCustomMedia(root, { preserve: preserve });
				},
				AtRule: (atRule) => {
					if (!atRule.params) {
						return;
					}

					if (!atRule.params.includes('--')) {
						return;
					}

					const transformedParams = transformAtMediaListTokens(atRule.params, customMedia);
					if (!transformedParams || transformedParams.length === 0) {
						return;
					}

					if (transformedParams.length === 1) {
						if (atRule.params === transformedParams[0].replaceWith) {
							return;
						}

						atRule.cloneBefore({ params: transformedParams[0].replaceWith });

						if (!preserve) {
							atRule.remove();
							return;
						}

						return;
					}

					transformedParams.forEach((transformed) => {
						const clone = atRule.clone({ params: transformed.replaceWith });
						const encapsulate = atRule.clone({ params: transformed.encapsulateWith, nodes: [] });
						if (encapsulate.nodes && encapsulate.nodes.length) {
							encapsulate.each((child) => {
								child.remove();
							});
						}

						clone.parent = null;
						encapsulate.parent = null;

						encapsulate.append(clone);
						atRule.before(encapsulate);
					});

					if (!preserve) {
						atRule.remove();
						return;
					}
				},
			};
		},
	};
};

creator.postcss = true;

export default creator;
