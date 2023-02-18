import type { Plugin } from 'postcss';
export type TestCaseOptions = {
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
