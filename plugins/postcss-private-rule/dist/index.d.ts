import type { PluginCreator } from 'postcss';

declare const creator: PluginCreator<pluginOptions>;
export default creator;
export { creator as 'module.exports' }

export declare const HAS_VAR_OR_IF_FUNCTION_REGEX: RegExp;

export declare const IS_CONTAINER_REGEX: RegExp;

export declare const IS_IF_FUNCTION_REGEX: RegExp;

export declare const IS_STYLE_FUNCTION_REGEX: RegExp;

export declare const IS_VAR_FUNCTION_REGEX: RegExp;

/** postcss-private-rule plugin options */
export declare type pluginOptions = never;

export { }
