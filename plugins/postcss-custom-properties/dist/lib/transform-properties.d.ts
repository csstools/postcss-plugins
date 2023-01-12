import { ParsedValue } from 'postcss-value-parser';
import type { PluginOptions } from './options';
import type { Declaration } from 'postcss';
declare const _default: (decl: Declaration, customProperties: Map<string, ParsedValue>, opts: Pick<PluginOptions, 'preserve'>) => void;
export default _default;
