import postcss from 'postcss';
import getCustomMedia from './lib/custom-media-from-root';
import transformAtrules from './lib/transform-atrules';
import importCustomMediaFromSources from './lib/import-from';
import exportCustomMediaToDestinations from './lib/export-to';

export default postcss.plugin('postcss-custom-media', opts => {
	// whether to preserve custom selectors and rules using them
	const preserve = Boolean(Object(opts).preserve);

	// sources to import custom selectors from
	const importFrom = [].concat(Object(opts).importFrom || []);

	// destinations to export custom selectors to
	const exportTo = [].concat(Object(opts).exportTo || []);

	// promise any custom selectors are imported
	const customMediaPromise = importCustomMediaFromSources(importFrom);

	return async root => {
		const customMedia = Object.assign(
			await customMediaPromise,
			getCustomMedia(root, { preserve })
		);

		await exportCustomMediaToDestinations(customMedia, exportTo);

		transformAtrules(root, customMedia, { preserve });
	};
});
