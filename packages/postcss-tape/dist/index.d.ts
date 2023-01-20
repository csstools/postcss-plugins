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
};
export default function runner(currentPlugin: PluginCreator<unknown>): (options: Record<string, TestCaseOptions>) => Promise<void>;
export {};
