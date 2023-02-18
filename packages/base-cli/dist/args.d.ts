export type Arguments = {
    stdin: boolean;
    stdout: boolean;
    inputs: Array<string>;
    output: string | undefined;
    outputDir: string | undefined;
    externalMap: boolean;
    inlineMap: boolean;
    replace: boolean;
    pluginOptions: Record<string, unknown>;
    debug: boolean;
};
export declare enum SignalValue {
    InvalidArguments = "INVALID_ARGUMENTS"
}
export declare function parseArguments(args: Array<string>, allowedPluginOpts: Array<string>, helpLogger: () => void): Arguments | SignalValue;
