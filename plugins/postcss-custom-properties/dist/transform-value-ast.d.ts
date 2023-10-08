import valuesParser from 'postcss-value-parser';
export default function transformValueAST(root: valuesParser.ParsedValue, customProperties: Map<string, valuesParser.ParsedValue>, localCustomProperties: Map<string, valuesParser.ParsedValue>): string;
