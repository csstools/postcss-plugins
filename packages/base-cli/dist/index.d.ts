import type { PluginCreator } from 'postcss';
export * from './help';
declare type PluginCreatorOptions = Record<string, unknown> | null;
export declare function cli(plugin: PluginCreator<PluginCreatorOptions>, allowedPluginOpts: Array<string>, helpLogger: () => void, standalone?: boolean): Promise<void>;
