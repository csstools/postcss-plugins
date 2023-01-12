import { Declaration } from 'postcss';

export type ImportFromSource = { from: string, type?: string } | string;
export type ImportCustomProperties = { customProperties?: Record<string, string>, 'custom-properties'?: Record<string, string> };
export type ImportAsFunction = () => ImportFromSource | ImportCustomProperties
export type ImportAsPromise = Promise<ImportFromSource | ImportCustomProperties>
export type ImportAsFunctionPromise = () => Promise<ImportFromSource | ImportCustomProperties>
export type ImportOptions = ImportFromSource | ImportCustomProperties | ImportAsFunction | ImportAsPromise | ImportAsFunctionPromise;

export type ExportJSONFunction = (customProperties?: Record<string, string>) => Record<string, string>;
export type ExportToSource = { to: string, type?: string, toJSON: ExportJSONFunction } | string;
export type ExportCustomProperties = { customProperties?: Record<string, string>, 'custom-properties'?: Record<string, string>, toJSON: ExportJSONFunction };
export type ExportAsFunction = (ExportCustomProperties) => void
export type ExportAsFunctionPromise = (ExportCustomProperties) => Promise<void>
export type ExportOptions = ExportToSource | ExportCustomProperties | ExportAsFunction | ExportAsFunctionPromise;

export type PreserveOptions = boolean | ((declaration: Declaration) => boolean);

export interface PluginOptions {
	/** Do not emit warnings about "importFrom" and "exportTo" deprecations */
	disableDeprecationNotice?: boolean;

	/** Determines whether Custom Properties and properties using custom properties should be preserved in their original form. */
	preserve?: PreserveOptions;

	/** Specifies sources where Custom Properties can be imported from, which might be CSS, JS, and JSON files, functions, and directly passed objects. */
	importFrom?: ImportOptions | Array<ImportOptions>

	/** Specifies destinations where Custom Properties can be exported to, which might be CSS, JS, and JSON files, functions, and directly passed objects. */
	exportTo?: ExportOptions | Array<ExportOptions>

	/** Specifies if `importFrom` properties or `:root` properties have priority. */
	overrideImportFromWithRoot?: boolean
}
