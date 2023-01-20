import type { Declaration, Result } from 'postcss';
import { Token } from './data-formats/base/token';
import { parsedPluginOptions } from './options';
export declare function onCSSValue(tokens: Map<string, Token>, result: Result, decl: Declaration, opts: parsedPluginOptions): string;
