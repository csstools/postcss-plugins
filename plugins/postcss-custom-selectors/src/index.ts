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

	return {
		postcssPlugin: 'postcss-custom-selectors',
		prepare() {
			let customSelectors = new Map();

			return {
				Once: (root) => {
					customSelectors = getCustomSelectors(root);
				},
				Rule: (rule) => {
					if (!rule.selector.includes(':--')) {
						return;
					}

					transformRule(rule, customSelectors, { preserve: preserve });
				},
			};
		},
	};
};

creator.postcss = true;

export default creator;
