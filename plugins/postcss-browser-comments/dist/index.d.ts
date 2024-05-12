import type { PluginCreator } from 'postcss';

declare const creator: PluginCreator<pluginOptions>;
export default creator;

/** postcss-browser-comments plugin options */
export declare type pluginOptions = {
    /** The browserslist queries */
    browsers?: string | Array<string> | null | undefined;
};

export { }
