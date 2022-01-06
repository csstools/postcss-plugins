import type { PluginCreator } from 'postcss';
import splitSelectors from './split-selectors/split-selectors';

const creator: PluginCreator<{ preserve: boolean }> = (opts?: { preserve: boolean }) => {
	return {
		postcssPlugin: 'postcss-is-pseudo',
		Rule(rule, { result }) {
			if (!rule.selector) {
				return;
			}

			if (rule.selector.indexOf(':is') === -1) {
				return;
			}

			try {
				let didClone = false;
				splitSelectors(rule.selectors).forEach((selector) => {
					if (!selector) {
						return;
					}

					if (rule.selector.indexOf(selector) > -1) {
						return;
					}

					didClone = true;
					rule.cloneBefore({ selector: selector });
				});

				if (!opts?.preserve) {
					if (!didClone) {
						return;
					}

					rule.remove();
				}
			} catch (e) {
				rule.warn(result, `Failed to parse selector "${rule.selector}"`);
			}
		},
	};
};

creator.postcss = true;

export default creator;

