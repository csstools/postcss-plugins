import type { MediaQuery } from '@csstools/media-query-list-parser';
import type { Plugin, PluginCreator } from 'postcss';
import getCustomMedia from './custom-media-from-root';
import { transformAtMediaListTokens } from './transform-at-media/transform-at-media';

/** postcss-custom-media plugin options */
export type pluginOptions = {
	/** Preserve the original notation. default: false */
	preserve?: boolean,
};

// Custom media can reference each other and blow up exponentially.
// Bound the number of nodes generated while expanding custom media and the
// length of any single generated media query.
const MAX_MEDIA_EXPANSIONS = 10_000;
const MAX_MEDIA_QUERY_LENGTH = 100_000;

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
			let mediaExpansionBudget = MAX_MEDIA_EXPANSIONS;

			const spendBudget = (amount: number): void => {
				mediaExpansionBudget -= amount;
				if (mediaExpansionBudget < 0) {
					throw new Error('Maximum custom media expansion size exceeded, reduce the complexity of your custom media');
				}
			};

			const checkLength = (...lengths: Array<number>): void => {
				for (const length of lengths) {
					if (length > MAX_MEDIA_QUERY_LENGTH) {
						throw new Error('Maximum custom media expansion length exceeded, reduce the complexity of your custom media');
					}
				}
			};

			return {
				postcssPlugin: 'postcss-custom-media',
				Once(root, { result }): void {
					mediaExpansionBudget = MAX_MEDIA_EXPANSIONS;
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

					let transformedParams: Array<{ replaceWith: string, encapsulateWith?: Array<string> }>;

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

						spendBudget(1);
						checkLength(transformedParams[0].replaceWith.length);
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
						spendBudget(transformedParams.length);
						checkLength(...transformedParams.map((x) => x.replaceWith.length));
						transformedNodes.add(atRule);
						atRule.cloneBefore({ params: transformedParams.map((x) => x.replaceWith).join(',').trim() });

						if (!preserve) {
							atRule.remove();
						}

						return;
					}

					transformedParams.forEach((transformed) => {
						if (!transformed.encapsulateWith?.length) {
							spendBudget(1);
							checkLength(transformed.replaceWith.length);
							atRule.cloneBefore({ params: transformed.replaceWith.trim() });
							return;
						}

						spendBudget(transformed.encapsulateWith.length + 1);
						checkLength(transformed.replaceWith.length, ...transformed.encapsulateWith.map((x) => x.length));

						const clone = atRule.clone({ params: transformed.replaceWith });
						clone.parent = undefined;

						let encapsulate = atRule.clone({ params: transformed.encapsulateWith[0], nodes: [] });
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
					}
				},
			};
		},
	};
};

creator.postcss = true;

export default creator;
export { creator as 'module.exports' };
