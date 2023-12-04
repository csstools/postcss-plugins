import { PluginCreator } from 'postcss';
type pluginOptions = {
    importAtRuleName: string;
    is?: Array<string>;
    unitsAndValues?: {
        rootFontSize?: number;
    };
    valueFunctionName: string;
};
declare const creator: PluginCreator<pluginOptions>;
export = creator;
