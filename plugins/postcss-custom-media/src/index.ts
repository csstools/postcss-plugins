import type { MediaQuery } from '@csstools/media-query-list-parser';
import type { Plugin, PluginCreator } from 'postcss';
import getCustomMedia from './custom-media-from-root';
import { transformAtMediaListTokens } from './transform-at-media/transform-at-media';

/** postcss-custom-media plugin options */
export type pluginOptions = {
	/** Preserve the original notation. default: false */
	preserve?: boolean,
};

const creator: PluginCreator<pluginOptions> = (opts?: pluginOptions) => {
	// whether to preserve custom media and rules using them
	const preserve = opts?.preserve ?? false;

	if ('importFrom' in Object(opts)) {
		throw new Error('[postcss-custom-media] "importFrom" is no longer supported');
	}

	if ('exportTo' in Object(opts)) {
		throw new Error('[postcss-custom-media] "exportTo" is no longer supported');
	}

	return {
		postcssPlugin: 'postcss-custom-media',
		prepare(): Plugin {
			const transformedNodes = new WeakSet();
			let customMedia: Map<string, { truthy: Array<MediaQuery>, falsy: Array<Array<MediaQuery>> }> = new Map();

			return {
				postcssPlugin: 'postcss-custom-media',
				Once(root, { result }): void {
					customMedia = getCustomMedia(root, result, { preserve: preserve });
				},
				AtRule(atRule, { result }): void {
					if (transformedNodes.has(atRule)) {
						return;
					}

					if (atRule.name.toLowerCase() !== 'media') {
						return;
					}

					if (!atRule.params) {
						return;
					}

					if (!atRule.params.includes('--')) {
						return;
					}

					let transformedParams: Array<{ replaceWith: string, encapsulateWith?: Array<string> }> = [];

					try {
						transformedParams = transformAtMediaListTokens(atRule.params, customMedia);
					} catch (err) {
						atRule.warn(result, `Failed to parse @custom-media params with error message: "${(err instanceof Error) ? err.message : err}"`);
						return;
					}

					if (!transformedParams || transformedParams.length === 0) {
						return;
					}

					if (transformedParams.length === 1) {
						if (atRule.params.trim() === transformedParams[0].replaceWith.trim()) {
							return;
						}

						transformedNodes.add(atRule);
						atRule.cloneBefore({ params: transformedParams[0].replaceWith.trim() });

						if (!preserve) {
							atRule.remove();
							return;
						}

						return;
					}

					const needsEncapsulation = !!(transformedParams.find((x) => {
						return !!(x.encapsulateWith?.length);
					}));

					if (!needsEncapsulation) {
						transformedNodes.add(atRule);
						atRule.cloneBefore({ params: transformedParams.map((x) => x.replaceWith).join(',').trim() });

						if (!preserve) {
							atRule.remove();
						}

						return;
					}

					transformedParams.forEach((transformed) => {
						if (!transformed.encapsulateWith?.length) {
							atRule.cloneBefore({ params: transformed.replaceWith.trim() });
							return;
						}

						const clone = atRule.clone({ params: transformed.replaceWith });
						clone.parent = undefined;

						let encapsulate = atRule.clone({ params: transformed.encapsulateWith[0], nodes: [] })
						encapsulate.parent = undefined;

						encapsulate.append(clone);

						transformed.encapsulateWith.slice(1).forEach((encapsulateWith) => {
							const encapsulateAgain = atRule.clone({ params: encapsulateWith, nodes: [] });
							encapsulateAgain.parent = undefined;

							encapsulateAgain.append(encapsulate);
							encapsulate = encapsulateAgain;
						});

						transformedNodes.add(atRule);
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
export { creator as 'module.exports' };
