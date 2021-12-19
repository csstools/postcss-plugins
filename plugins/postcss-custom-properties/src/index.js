import getCustomPropertiesFromRoot from './lib/get-custom-properties-from-root';
import getCustomPropertiesFromImports from './lib/get-custom-properties-from-imports';
import transformProperties from './lib/transform-properties';
import writeCustomPropertiesToExports from './lib/write-custom-properties-to-exports';

const creator = opts => {
	// whether to preserve custom selectors and rules using them
	const preserve = 'preserve' in Object(opts) ? Boolean(opts.preserve) : true;

	// sources to import custom selectors from
	const importFrom = [].concat(Object(opts).importFrom || []);

	// destinations to export custom selectors to
	const exportTo = [].concat(Object(opts).exportTo || []);

	// promise any custom selectors are imported
	const customPropertiesPromise = getCustomPropertiesFromImports(importFrom);

	let customProperties;

	// whether to return synchronous function if no asynchronous operations are requested
	const canReturnSyncFunction = importFrom.length === 0 && exportTo.length === 0;

	return {
		postcssPlugin: 'postcss-custom-properties',
		prepare ({ root }) {
			if (canReturnSyncFunction) {
				customProperties = getCustomPropertiesFromRoot(root, { preserve });

				return {
					Declaration: (decl) => transformProperties(decl, customProperties, { preserve }),
				};
			} else {
				return {
					Once: async root => {
						customProperties = Object.assign(
							{},
							getCustomPropertiesFromRoot(root, { preserve }),
							await customPropertiesPromise,
						);

						await writeCustomPropertiesToExports(customProperties, exportTo);
					},
					Declaration: (decl) => transformProperties(decl, customProperties, { preserve }),
				};
			}
		},
	};
};

creator.postcss = true;

export default creator;
