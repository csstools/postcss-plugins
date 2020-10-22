import getCustomSelectors from './lib/custom-selectors-from-root';
import transformRules from './lib/transform-rules';
import importCustomSelectorsFromSources from './lib/import-from';
import exportCustomSelectorsToDestinations from './lib/export-to';

const postcssCustomSelectors = (opts) => {
	// whether to preserve custom selectors and rules using them
	const preserve = Boolean(Object(opts).preserve);

	// sources to import custom selectors from
	const importFrom = [].concat(Object(opts).importFrom || []);

	// destinations to export custom selectors to
	const exportTo = [].concat(Object(opts).exportTo || []);

	// promise any custom selectors are imported
	const customSelectorsPromise = importCustomSelectorsFromSources(importFrom);
	return {
		postcssPlugin: 'postcss-custom-selectors',
		async Once(root) {
			const customProperties = Object.assign(
				{},
				await customSelectorsPromise,
				getCustomSelectors(root, { preserve })
			);

			await exportCustomSelectorsToDestinations(customProperties, exportTo);

			transformRules(root, customProperties, { preserve });
		},
	}
};

postcssCustomSelectors.postcss = true;

export default postcssCustomSelectors;
