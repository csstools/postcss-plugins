import type { PluginCreator } from 'postcss';
import splitSelectors from './split-selectors/split-selectors';

const creator: PluginCreator<{ preserve: boolean }> = (opts?: { preserve: boolean }) => {
	return {
		postcssPlugin: 'postcss-is-pseudo',
		Rule(rule) {
			if (!rule.selector) {
				return;
			}

			if (rule.selector.indexOf(':is') === -1) {
				return;
			}

			splitSelectors(rule.selectors).forEach((selector) => {
				if (selector) {
					rule.cloneBefore({ selector: selector });
				}
			});
		},
	};
};

creator.postcss = true;

export default creator;

