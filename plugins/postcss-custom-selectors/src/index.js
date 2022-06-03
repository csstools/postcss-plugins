import getCustomSelectors from './custom-selectors-from-root';
import transformRule from './transform-rule';
import importCustomSelectorsFromSources from './import-from';
import exportCustomSelectorsToDestinations from './export-to';

const creator = (opts) => {
	// whether to preserve custom selectors and rules using them
	const preserve = Boolean(Object(opts).preserve);

	// sources to import custom selectors from
	const importFrom = [].concat(Object(opts).importFrom || []);

	// destinations to export custom selectors to
	const exportTo = [].concat(Object(opts).exportTo || []);

	// promise any custom selectors are imported
	const customSelectorsPromise = importCustomSelectorsFromSources(importFrom);

	const customSelectorHelperKey = Symbol('customSelectorHelper');

	return {
		postcssPlugin: 'postcss-custom-selectors',
		Once: async (root, helpers) => {
			helpers[customSelectorHelperKey] = Object.assign(
				await customSelectorsPromise,
				getCustomSelectors(root, { preserve }),
			);

			await exportCustomSelectorsToDestinations(helpers[customSelectorHelperKey], exportTo);
		},
		Rule: (rule, helpers) => {
			if (!rule.selector.includes(':--')) {
				return;
			}

			transformRule(rule, helpers[customSelectorHelperKey], { preserve });
		},
	};
};

creator.postcss = true;

export default creator;


