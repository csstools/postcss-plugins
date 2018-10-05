import postcss from 'postcss';
import getCustomMediaFromRoot from './lib/custom-media-from-root';
import getCustomMediaFromImports from './lib/get-custom-media-from-imports';
import transformAtrules from './lib/transform-atrules';
import writeCustomMediaToExports from './lib/write-custom-media-to-exports';

export default postcss.plugin('postcss-custom-media', opts => {
	// whether to preserve custom media and at-rules using them
	const preserve = 'preserve' in Object(opts) ? Boolean(opts.preserve) : false;

	// sources to import custom media from
	const importFrom = [].concat(Object(opts).importFrom || []);

	// destinations to export custom media to
	const exportTo = [].concat(Object(opts).exportTo || []);

	// promise any custom media are imported
	const customMediaPromise = getCustomMediaFromImports(importFrom);

	return async root => {
		const customMedia = Object.assign(
			await customMediaPromise,
			getCustomMediaFromRoot(root, { preserve })
		);

		await writeCustomMediaToExports(customMedia, exportTo);

		transformAtrules(root, customMedia, { preserve });
	};
});
