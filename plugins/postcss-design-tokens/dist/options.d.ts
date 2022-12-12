export type pluginOptions = {
    importAtRuleName: string;
    is?: Array<string>;
    unitsAndValues?: {
        rootFontSize?: number;
    };
    valueFunctionName: string;
};
export type parsedPluginOptions = {
    importAtRuleName: string;
    is: Array<string>;
    unitsAndValues: {
        rootFontSize: number;
    };
    valueFunctionName: string;
};
export declare function parsePluginOptions(opts?: pluginOptions): parsedPluginOptions;
