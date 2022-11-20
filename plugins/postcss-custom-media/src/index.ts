import { MediaQuery } from '@csstools/media-query-list-parser';
import type { PluginCreator } from 'postcss';
import getCustomMedia from './custom-media-from-root';
import { transformAtMediaListTokens } from './transform-at-media/transform-at-media';

/** postcss-custom-media plugin options */
export type pluginOptions = {
	/** Preserve the original notation. default: false */
	preserve?: boolean,
};

const creator: PluginCreator<pluginOptions> = (opts?: pluginOptions) => {
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
			let customMedia: Map<string, { truthy: Array<MediaQuery>, falsy: Array<MediaQuery> }> = new Map();

			return {
				Once: (root, { result }) => {
					customMedia = getCustomMedia(root, result, { preserve: preserve });
				},
				AtRule: (atRule, { result }) => {
					if (!atRule.params) {
						return;
					}

					if (!atRule.params.includes('--')) {
						return;
					}

					let transformedParams: Array<{ replaceWith: string, encapsulateWith?: string }> = [];

					try {
						transformedParams = transformAtMediaListTokens(atRule.params, customMedia);
					} catch (err) {
						atRule.warn(result, `Failed to parse @custom-media params with error message: "${err.message}"`);
						return;
					}

					if (!transformedParams || transformedParams.length === 0) {
						return;
					}

					if (transformedParams.length === 1) {
						if (atRule.params.trim() === transformedParams[0].replaceWith.trim()) {
							return;
						}

						atRule.cloneBefore({ params: transformedParams[0].replaceWith.trim() });

						if (!preserve) {
							atRule.remove();
							return;
						}

						return;
					}

					const needsEncapsulation = !!(transformedParams.find((x) => {
						return !!x.encapsulateWith;
					}));

					if (!needsEncapsulation) {
						atRule.cloneBefore({ params: transformedParams.map((x) => x.replaceWith).join(',').trim() });

						if (!preserve) {
							atRule.remove();
						}

						return;
					}

					transformedParams.forEach((transformed) => {
						if (!transformed.encapsulateWith) {
							atRule.cloneBefore({ params: transformed.replaceWith.trim() });
							return;
						}

						const clone = atRule.clone({ params: transformed.replaceWith });
						const encapsulate = atRule.clone({ params: transformed.encapsulateWith.trim(), nodes: [] });

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
