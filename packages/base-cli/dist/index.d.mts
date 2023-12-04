import { PluginCreator } from 'postcss';
type Arguments = {
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
declare enum SignalValue {
    InvalidArguments = "INVALID_ARGUMENTS"
}
declare function parseArguments(args: Array<string>, allowedPluginOpts: Array<string>, helpLogger: () => void): Arguments | SignalValue;
declare function helpTextLogger(command: string, name: string, description: string, exampleOptions?: Record<string, unknown> | null): () => void;
type PluginCreatorOptions = Record<string, unknown> | null;
declare function cli(plugin: PluginCreator<PluginCreatorOptions>, allowedPluginOpts: Array<string>, helpLogger: () => void, standalone?: boolean): Promise<void>;
export { parseArguments, helpTextLogger, cli };
