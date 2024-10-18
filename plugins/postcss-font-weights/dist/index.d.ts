import type { PluginCreator } from 'postcss';

declare const creator: PluginCreator<pluginOptions>;
export default creator;

/** postcss-font-weights plugin options */
export declare type pluginOptions = {
    /** Determine the prefix applied to properties being processed */
    prefix?: string;
    /** Additional font weight keywords and numeric pairs */
    weights?: Record<string, number>;
};

export { }
