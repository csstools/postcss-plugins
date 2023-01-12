import type { Root } from 'postcss';
import valuesParser from 'postcss-value-parser';
import { PluginOptions } from './options';
export default function getCustomPropertiesFromRoot(root: Root, opts: Pick<PluginOptions, 'preserve'>): Map<string, valuesParser.ParsedValue>;
