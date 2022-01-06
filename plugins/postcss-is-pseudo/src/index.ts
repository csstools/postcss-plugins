import type { PluginCreator } from 'postcss';
import splitSelectors from './split-selectors/split-selectors';

const creator: PluginCreator<
	{
		preserve?: boolean,
		oncomplex?: 'warning' | 'skip',
		doesNotExistName?: string,
	}
> = (opts?: { preserve?: boolean, oncomplex?: 'warning' | 'skip', doesNotExistName?: string }) => {
	const options = {
		doesNotExistName: 'does-not-exist',
		...(opts || {}),
	};

	return {
		postcssPlugin: 'postcss-is-pseudo',
		Rule(rule, { result }) {
			if (!rule.selector) {
				return;
			}

			if (rule.selector.indexOf(':is') === -1) {
				return;
			}

			// Because of loops and recursion we try to only warn once per selector.
			let didWarn = false;
			const warnOnComplexSelector = () => {
				if (options.oncomplex !== 'warning') {
					return;
				}
				if (didWarn) {
					return;
				}

				didWarn = true;
				rule.warn(result, `Complex selectors in '${rule.selector}' will have different matching after transforming.`);
			};

			try {
				let didClone = false;
				const untouched = [];
				splitSelectors(rule.selectors, options, warnOnComplexSelector).forEach((modifiedSelector) => {
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

				if (!options.preserve) {
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

