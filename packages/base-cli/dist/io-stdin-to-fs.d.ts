import type { Plugin } from 'postcss';
import { Arguments } from './args';
export declare function stdinToFs(plugin: Plugin, argo: Arguments, helpLogger: () => void): Promise<never>;
