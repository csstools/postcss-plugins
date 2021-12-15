import type * as PostCSS from 'postcss'

type ImportExportObject = { customProperties: {} }
type ImportExportFunction = (customProperties?: {}) => ImportExportObject
type ImportExportFilepath = string

type ImportExport = ImportExportFilepath | ImportExportObject | ImportExportFunction | (ImportExportFilepath | ImportExportObject | ImportExportFunction)[]

export interface PluginOptions {
	/** Determines whether Custom Properties and properties using custom properties should be preserved in their original form. */
	preserve?: boolean

	/** Specifies sources where Custom Properties can be imported from, which might be CSS, JS, and JSON files, functions, and directly passed objects. */
	importFrom?: ImportExport

	/** Specifies destinations where Custom Properties can be exported to, which might be CSS, JS, and JSON files, functions, and directly passed objects. */
	exportTo?: ImportExport
}

export interface Plugin {
	(options?: PluginOptions): {
		postcssPlugin: 'postcss-custom-properties',
		prepare({ root }: { root: any }): (
			| {
				Declaration: (decl: any) => void;
				Once?: undefined;
			}
			| {
				Once: (root: any) => Promise<void>;
				Declaration: (decl: any) => void;
			}
		)
	},
	postcss: true
}

declare const plugin: Plugin

export default plugin
