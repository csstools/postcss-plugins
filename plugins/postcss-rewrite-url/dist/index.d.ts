import type { PluginCreator } from 'postcss';

declare const creator: PluginCreator<pluginOptions>;
export default creator;

/** postcss-rewrite-url plugin options */
export declare type pluginOptions = {
    rewriter: Rewriter;
};

export declare interface RewriteContext {
    type: 'declaration-value' | 'at-rule-prelude';
    from: string | undefined;
    rootFrom: string | undefined;
    property?: string;
    atRuleName?: string;
}

export declare type Rewriter = (value: ValueToRewrite, context: RewriteContext) => ValueToRewrite | false;

export declare interface ValueToRewrite {
    url: string;
    urlModifiers: Array<string>;
}

export { }
