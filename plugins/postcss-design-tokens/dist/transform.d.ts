import type { Node, Result } from 'postcss';
import { Token } from './data-formats/base/token';
import { parsedPluginOptions } from './options';
export declare function transform(tokens: Map<string, Token>, result: Result, postCSSNode: Node, source: string, opts: parsedPluginOptions): string;
