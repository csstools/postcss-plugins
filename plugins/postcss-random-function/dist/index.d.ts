import type { PluginCreator } from 'postcss';

declare const creator: PluginCreator<pluginOptions>;
export default creator;
export { creator as 'module.exports' }

/** postcss-random-function plugin options */
export declare type pluginOptions = {
    /** Preserve the original notation. default: false */
    preserve?: boolean;
};

export { }
