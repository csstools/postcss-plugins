import type { PluginCreator } from 'postcss';

declare const creator: PluginCreator<pluginOptions>;
export default creator;

export declare type pluginOptions = {
    importAtRuleName: string;
    is?: Array<string>;
    unitsAndValues?: {
        rootFontSize?: number;
    };
    valueFunctionName: string;
};

export { }
