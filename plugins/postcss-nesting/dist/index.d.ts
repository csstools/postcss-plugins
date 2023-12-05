import type { PluginCreator } from 'postcss';

declare const creator: PluginCreator<pluginOptions>;
export default creator;

/** postcss-nesting plugin options */
export declare type pluginOptions = {
    /** Avoid the `:is()` pseudo class as much as possible. default: false */
    noIsPseudoSelector?: boolean;
    /** Silence the `@nest` warning. */
    silenceAtNestWarning?: boolean;
};

export { }
