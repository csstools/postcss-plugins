import type { PluginCreator } from 'postcss';

declare const creator: PluginCreator<pluginOptions>;
export default creator;
export { creator as 'module.exports' }

/** postcss-global-data plugin options */
export declare type pluginOptions = {
    /** List of files to be used as context */
    files?: Array<string>;
    /** Remove nodes in a separate plugin object, this object can be added later in your list of plugins */
    lateRemover?: boolean;
    /** Add global CSS to the start of files, defaults to `false` */
    prepend?: boolean;
};

export { }
