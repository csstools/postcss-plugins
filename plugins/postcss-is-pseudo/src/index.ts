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
				const untouched = [];
				splitSelectors(rule.selectors).forEach((modifiedSelector) => {
					// `::is()` is incorrect but can't be detected without parsing.
					// It will be left as is and will eventually trigger this condition.
					// This prevents an infinite loop.
					// didClone is the signal to prevent the infinite loop.
					if (rule.selectors.indexOf(modifiedSelector) > -1) {
						untouched.push(modifiedSelector);
						return;
					}

					rule.cloneBefore({ selector: modifiedSelector });
					didClone = true;
				});

				if (untouched.length && didClone) {
					rule.cloneBefore({ selectors: untouched });
				}

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

