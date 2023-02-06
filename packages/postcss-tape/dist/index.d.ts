import type { PluginCreator, Plugin } from 'postcss';
type TestCaseOptions = {
    message?: string;
    options?: unknown;
    plugins?: Array<Plugin>;
    warnings?: number;
    exception?: RegExp;
    expect?: string;
    result?: string;
    before?: () => void;
    after?: () => void | Promise<void>;
    postcssSyntaxHTML?: boolean;
};
export declare function postcssTape(currentPlugin: PluginCreator<unknown>): (options: Record<string, TestCaseOptions>) => Promise<void>;
export declare const declarationClonerPlugin: {
    postcssPlugin: string;
    Declaration(decl: any): void;
};
export declare const ruleClonerPlugin: {
    postcssPlugin: string;
    prepare(): {
        RuleExit(rule: any): void;
    };
};
export {};
