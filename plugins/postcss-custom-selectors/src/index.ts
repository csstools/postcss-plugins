import type { Plugin, PluginCreator } from 'postcss';
import type { Root } from 'postcss-selector-parser';
import getCustomSelectors from './custom-selectors-from-root';
import { transformRule } from './transform-rule';

/** postcss-custom-selectors plugin options */
export type pluginOptions = {
	/** Preserve the original notation. default: false */
	preserve?: boolean,
};

const creator: PluginCreator<pluginOptions> = (opts?: pluginOptions) => {
	// whether to preserve custom selectors and rules using them
	const preserve = opts?.preserve ?? false;

	if ('importFrom' in Object(opts)) {
		throw new Error('[postcss-custom-selectors] "importFrom" is no longer supported');
	}

	if ('exportTo' in Object(opts)) {
		throw new Error('[postcss-custom-selectors] "exportTo" is no longer supported');
	}

	return {
		postcssPlugin: 'postcss-custom-selectors',
		prepare(): Plugin {
			const transformedNodes = new WeakSet();
			let customSelectors: Map<string, Root> = new Map();

			return {
				postcssPlugin: 'postcss-custom-selectors',
				Once(root, { result }): void {
					customSelectors = getCustomSelectors(root, result, { preserve: preserve });
				},
				Rule(rule, { result }): void {
					if (transformedNodes.has(rule)) {
						return;
					}

					if (!rule.selector?.includes(':--')) {
						return;
					}

					const modifiedSelector = transformRule(rule, result, customSelectors);
					if (modifiedSelector === rule.selector) {
						return;
					}

					transformedNodes.add(rule);
					rule.cloneBefore({ selector: modifiedSelector });

					if (!preserve) {
						rule.remove();
					}
				},
			};
		},
	};
};

creator.postcss = true;

export default creator;
export { creator as 'module.exports' };
