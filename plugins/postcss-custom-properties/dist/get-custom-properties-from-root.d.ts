import type { Root } from 'postcss';
import valuesParser from 'postcss-value-parser';
export default function getCustomPropertiesFromRoot(root: Root, parsedValuesCache: Map<string, valuesParser.ParsedValue>): Map<string, valuesParser.ParsedValue>;
