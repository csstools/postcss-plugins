import type { PluginCreator } from 'postcss';

declare type Arguments = {
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

export declare function cli(plugin: PluginCreator<PluginCreatorOptions>, allowedPluginOpts: Array<string>, helpLogger: () => void, standalone?: boolean): Promise<void>;

export declare function helpTextLogger(command: string, name: string, description: string, exampleOptions?: Record<string, unknown> | null): () => void;

export declare function parseArguments(args: Array<string>, allowedPluginOpts: Array<string>, helpLogger: () => void): Arguments | SignalValue;

declare type PluginCreatorOptions = Record<string, unknown> | null;

declare enum SignalValue {
    InvalidArguments = "INVALID_ARGUMENTS"
}

export { }
