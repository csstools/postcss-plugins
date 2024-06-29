import type { Plugin, PluginCreator } from 'postcss';
import { replaceAnyLink } from './replace-any-link';

/** postcss-pseudo-class-any-link plugin options */
export type pluginOptions = {
	/** Preserve the original notation. default: true */
	preserve?: boolean,
	/** Add an extra fallback for the "<area>" element in IE and Edge. default: false */
	subFeatures?: {
		areaHrefNeedsFixing?: boolean
	},
};

const creator: PluginCreator<pluginOptions> = (opts?: pluginOptions) => {
	const options = {
		preserve: opts?.preserve ?? true,
		subFeatures: {
			areaHrefNeedsFixing: opts?.subFeatures?.areaHrefNeedsFixing ?? false,
		},
	};

	return {
		postcssPlugin: 'postcss-pseudo-class-any-link',
		prepare(): Plugin {
			const transformedNodes = new WeakSet();

			return {
				postcssPlugin: 'postcss-pseudo-class-any-link',
				Rule(rule, { result }): void {
					if (!rule.selector.toLowerCase().includes(':any-link')) {
						return;
					}

					if (transformedNodes.has(rule)) {
						return;
					}

					const rawSelector = rule.raws.selector && rule.raws.selector.raw || rule.selector;

					// workaround for https://github.com/postcss/postcss-selector-parser/issues/28#issuecomment-171910556
					if (rawSelector.endsWith(':')) {
						return;
					}

					const didReplace = replaceAnyLink(rule, result, options.preserve, options.subFeatures.areaHrefNeedsFixing);
					if (didReplace) {
						transformedNodes.add(rule);
					}
				},
			};
		},
	};
};

creator.postcss = true;

export default creator;
