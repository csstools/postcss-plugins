import type { PluginCreator } from 'postcss';
import type valuesParser from 'postcss-value-parser';

import getCustomPropertiesFromRoot from './lib/get-custom-properties-from-root';
import getCustomPropertiesFromImports from './lib/get-custom-properties-from-imports';
import transformProperties from './lib/transform-properties';
import writeCustomPropertiesToExports from './lib/write-custom-properties-to-exports';
import type { ImportOptions, ExportOptions, PluginOptions } from './lib/options';

const creator: PluginCreator<PluginOptions> = (opts?: PluginOptions) => {
	// whether to preserve custom selectors and rules using them
	const preserve = 'preserve' in Object(opts)
		? (typeof opts.preserve === 'function'
			? opts.preserve
			: Boolean(opts.preserve))
		: true;
	const overrideImportFromWithRoot = 'overrideImportFromWithRoot' in Object(opts) ? Boolean(opts.overrideImportFromWithRoot) : false;
	const disableDeprecationNotice = 'disableDeprecationNotice' in Object(opts) ? Boolean(opts.disableDeprecationNotice) : false;

	// sources to import custom selectors from
	let importFrom: Array<ImportOptions> = [];
	if (Array.isArray(opts?.importFrom)) {
		importFrom = opts.importFrom;
	} else if (opts?.importFrom) {
		importFrom = [opts.importFrom];
	}

	// destinations to export custom selectors to
	let exportTo: Array<ExportOptions> = [];
	if (Array.isArray(opts?.exportTo)) {
		exportTo = opts.exportTo;
	} else if (opts?.exportTo) {
		exportTo = [opts.exportTo];
	}

	// promise any custom selectors are imported
	const customPropertiesPromise = getCustomPropertiesFromImports(importFrom);

	// whether to return synchronous function if no asynchronous operations are requested
	const canReturnSyncFunction = importFrom.length === 0 && exportTo.length === 0;

	return {
		postcssPlugin: 'postcss-custom-properties',
		prepare () {
			let customProperties: Map<string, valuesParser.ParsedValue> = new Map();

			if (canReturnSyncFunction) {
				return {
					Once: (root) => {
						customProperties = getCustomPropertiesFromRoot(root, { preserve });
					},
					Declaration: (decl) => {
						transformProperties(decl, customProperties, { preserve });
					},
					OnceExit: () => {
						customProperties.clear();
					},
				};
			} else {
				return {
					Once: async root => {
						const importedCustomerProperties = (await customPropertiesPromise).entries();
						const rootCustomProperties = getCustomPropertiesFromRoot(root, { preserve }).entries();

						if (overrideImportFromWithRoot) {
							for (const [name, value] of [...importedCustomerProperties, ...rootCustomProperties]) {
								customProperties.set(name, value);
							}
						} else {
							for (const [name, value] of [...rootCustomProperties, ...importedCustomerProperties]) {
								customProperties.set(name, value);
							}
						}

						await writeCustomPropertiesToExports(customProperties, exportTo);
					},
					Declaration: (decl) => {
						transformProperties(decl, customProperties, { preserve });
					},
					OnceExit: (root, { result }) => {
						if (!disableDeprecationNotice && (importFrom.length > 0 || exportTo.length > 0)) {
							root.warn(result, '"importFrom" and "exportTo" will be removed in a future version of postcss-custom-properties.\nWe are looking for insights and anecdotes on how these features are used so that we can design the best alternative.\nPlease let us know if our proposal will work for you.\nVisit the discussion on github for more details. https://github.com/csstools/postcss-plugins/discussions/192');
						}

						customProperties.clear();
					},
				};
			}
		},
	};
};

creator.postcss = true;

export default creator;
