import type { PluginCreator } from 'postcss';

declare const creator: PluginCreator<pluginOptions>;
export default creator;

/** postcss-rewrite-url plugin options */
export declare type pluginOptions = {
    rewriter: Rewriter;
};

export declare interface RewriteContext {
    from: string | undefined;
    rootFrom: string | undefined;
}

export declare type Rewriter = (value: ValueToRewrite, context: RewriteContext) => ValueToRewrite;

export declare interface ValueToRewrite {
    url: string;
}

export { }
