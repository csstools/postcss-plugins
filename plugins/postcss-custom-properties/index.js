import postcss from 'postcss';
import getCustomProperties from './lib/get-custom-properties';
import transformProperties from './lib/transform-properties';
import importCustomPropertiesFromSources from './lib/import-from';
import exportCustomPropertiesToDestinations from './lib/export-to';

export default postcss.plugin('postcss-custom-properties', opts => {
	// whether to preserve custom selectors and rules using them
	const preserve = 'preserve' in Object(opts) ? Boolean(opts.preserve) : true;

	// sources to import custom selectors from
	const importFrom = [].concat(Object(opts).importFrom || []);

	// destinations to export custom selectors to
	const exportTo = [].concat(Object(opts).exportTo || []);

	// promise any custom selectors are imported
	const customPropertiesPromise = importCustomPropertiesFromSources(importFrom);

	return async root => {
		const customProperties = Object.assign(
			await customPropertiesPromise,
			getCustomProperties(root, { preserve })
		);

		await exportCustomPropertiesToDestinations(customProperties, exportTo);

		transformProperties(root, customProperties, { preserve });
	};
});
