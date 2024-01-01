import type { PluginCreator } from 'postcss';

declare const creator: PluginCreator<pluginOptions>;
export default creator;

export declare type pluginOptions = {
    /** Mapping of queries */
    queries: Record<string, string>;
    /** Extract after transforms are likely to be done, or before it */
    extractLate: boolean;
    /** Callback for results */
    results: (results: Record<string, Array<Record<string, unknown>>>) => void;
};

export { }
