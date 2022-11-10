import type { PluginCreator } from 'postcss';
import getCustomSelectors from './custom-selectors-from-root';
import transformRule from './transform-rule';

export interface PluginOptions {
	/** Determines whether Custom Selectors and selectors using custom selectors should be preserved in their original form. */
	preserve?: boolean
}

const creator: PluginCreator<PluginOptions> = (opts?: PluginOptions) => {
	// whether to preserve custom selectors and rules using them
	const preserve = Boolean(Object(opts).preserve);

	if ('importFrom' in Object(opts)) {
		throw new Error('[postcss-custom-selectors] "importFrom" is no longer supported');
	}

	if ('exportTo' in Object(opts)) {
		throw new Error('[postcss-custom-selectors] "exportTo" is no longer supported');
	}

	return {
		postcssPlugin: 'postcss-custom-selectors',
		prepare() {
			let customSelectors = new Map();

			return {
				Once: (root, { result }) => {
					customSelectors = getCustomSelectors(root, result, { preserve: preserve });
				},
				Rule: (rule, { result }) => {
					if (!rule.selector.includes(':--')) {
						return;
					}

					transformRule(rule, result, customSelectors, { preserve: preserve });
				},
			};
		},
	};
};

creator.postcss = true;

export default creator;
