export type ImportFromSource = {
    from: string;
    type?: string;
} | string;
export type ImportCustomProperties = {
    customProperties?: Record<string, string>;
    'custom-properties'?: Record<string, string>;
};
export type ImportAsFunction = () => ImportFromSource | ImportCustomProperties;
export type ImportAsPromise = Promise<ImportFromSource | ImportCustomProperties>;
export type ImportAsFunctionPromise = () => Promise<ImportFromSource | ImportCustomProperties>;
export type ImportOptions = ImportFromSource | ImportCustomProperties | ImportAsFunction | ImportAsPromise | ImportAsFunctionPromise;
export type ExportJSONFunction = (customProperties?: Record<string, string>) => Record<string, string>;
export type ExportToSource = {
    to: string;
    type?: string;
    toJSON: ExportJSONFunction;
} | string;
export type ExportCustomProperties = {
    customProperties?: Record<string, string>;
    'custom-properties'?: Record<string, string>;
    toJSON: ExportJSONFunction;
};
export type ExportAsFunction = (ExportCustomProperties: any) => void;
export type ExportAsFunctionPromise = (ExportCustomProperties: any) => Promise<void>;
export type ExportOptions = ExportToSource | ExportCustomProperties | ExportAsFunction | ExportAsFunctionPromise;
