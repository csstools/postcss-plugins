import { PluginCreator } from 'postcss';
/** postcss-nesting plugin options */
type pluginOptions = {
    /** Avoid the `:is()` pseudo class as much as possible. default: false */
    noIsPseudoSelector?: boolean;
    /** Silence the `@nest` warning. */
    silenceAtNestWarning?: boolean;
};
declare const creator: PluginCreator<pluginOptions>;
export { creator as default, pluginOptions };
