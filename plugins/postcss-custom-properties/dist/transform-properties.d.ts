import valuesParser from 'postcss-value-parser';
import type { Declaration } from 'postcss';
export declare function transformProperties(decl: Declaration, customProperties: Map<string, valuesParser.ParsedValue>, localCustomProperties: Map<string, valuesParser.ParsedValue>, parsedValuesCache: Map<string, valuesParser.ParsedValue>, opts: {
    preserve?: boolean;
}): void;
