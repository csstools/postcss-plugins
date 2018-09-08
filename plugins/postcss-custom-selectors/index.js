import postcss from 'postcss';
import getCustomSelectors from './lib/custom-selectors-from-root';
import transformRules from './lib/transform-rules';
import importCustomSelectorsFromSources from './lib/import-from';

export default postcss.plugin('postcss-custom-selectors', opts => {
	// whether to preserve custom selectors and rules using them
	const preserve = Boolean(Object(opts).preserve);

	// sources from where to import custom selectors
	const importFrom = [].concat(Object(opts).importFrom || []);

	// promise any custom selectors are imported
	const customSelectorsPromise = importCustomSelectorsFromSources(importFrom);

	return async root => {
		const customProperties = Object.assign(
			await customSelectorsPromise,
			getCustomSelectors(root, { preserve })
		);

		transformRules(root, customProperties, { preserve });
	};
});
