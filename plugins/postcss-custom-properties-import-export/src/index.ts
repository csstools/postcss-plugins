import getCustomPropertiesFromImports from './lib/get-custom-properties-from-imports';
import getCustomPropertiesFromRoot from './lib/get-custom-properties-from-root';
import writeCustomPropertiesToExports from './lib/write-custom-properties-to-exports';
import type { ImportOptions, ExportOptions } from './lib/options';
import type { PluginCreator } from 'postcss';

export interface PluginOptions {
	/** Specifies sources where Custom Properties can be imported from, which might be CSS, JS, and JSON files, functions, and directly passed objects. */
	importFrom?: ImportOptions | Array<ImportOptions>

	/** Specifies destinations where Custom Properties can be exported to, which might be CSS, JS, and JSON files, functions, and directly passed objects. */
	exportTo?: ExportOptions | Array<ExportOptions>

	/** Specifies if `importFrom` properties or `:root` properties have priority. */
	overrideImportFromWithRoot?: boolean
}

const creator: PluginCreator<PluginOptions> = (opts?: PluginOptions) => {
	const overrideImportFromWithRoot = 'overrideImportFromWithRoot' in Object(opts) ? Boolean(opts.overrideImportFromWithRoot) : false;

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

	return {
		postcssPlugin: 'postcss-custom-properties',
		prepare () {
			const customPropertiesForInsertion: Map<string, string> = new Map();
			const customPropertiesForExport: Map<string, string> = new Map();

			return {
				Once: async (root, { result, postcss }) => {
					const importedCustomerProperties = (await customPropertiesPromise).entries();
					const rootCustomProperties = getCustomPropertiesFromRoot(root).entries();

					for (const [name, value] of importedCustomerProperties) {
						customPropertiesForInsertion.set(name, value);
					}

					if (overrideImportFromWithRoot) {
						for (const [name, value] of [...importedCustomerProperties, ...rootCustomProperties]) {
							customPropertiesForExport.set(name, value);
						}
					} else {
						for (const [name, value] of [...rootCustomProperties, ...importedCustomerProperties]) {
							customPropertiesForExport.set(name, value);
						}
					}

					await writeCustomPropertiesToExports(customPropertiesForExport, exportTo);

					if (customPropertiesForInsertion.size > 0) {
						const propertyNames = Array.from(customPropertiesForInsertion.keys());
						// Inserting in reverse order results in the correct order.
						propertyNames.reverse();

						let operator = 'prepend';
						if (!overrideImportFromWithRoot) {
							operator = 'append';
						}

						const rootRule = postcss.rule({
							selector: ':root',
							source: {
								// eslint-disable-next-line @typescript-eslint/ban-ts-comment
								// @ts-ignore
								input: {
									from: result.opts.from,
								},
								start: { offset: 0, line: 1, column: 1 },
								end: { offset: 0, line: 1, column: 1 },
							},
						});

						root[operator](rootRule);

						propertyNames.forEach((propertyName) => {
							const decl = postcss.decl({
								prop: propertyName,
								value: customPropertiesForInsertion.get(propertyName),
							});

							decl.source = {
								// eslint-disable-next-line @typescript-eslint/ban-ts-comment
								// @ts-ignore
								input: {
									from: result.opts.from,
								},
								start: { offset: 0, line: 1, column: 1 },
								end: { offset: 0, line: 1, column: 1 },
							};

							rootRule.append(decl);
						});
					}
				},
			};
		},
	};
};

creator.postcss = true;

export default creator;
