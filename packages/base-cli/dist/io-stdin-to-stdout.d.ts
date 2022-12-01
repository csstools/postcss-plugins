import { Arguments } from './args';
import type { Plugin } from 'postcss';
export declare function stdinToStdout(plugin: Plugin, argo: Arguments, helpLogger: () => void): Promise<never>;
