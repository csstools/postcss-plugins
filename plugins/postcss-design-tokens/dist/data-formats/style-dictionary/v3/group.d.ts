import { Token } from '../../base/token';
import { StyleDictionaryV3TokenValue } from './value';
export type StyleDictionaryV3TokenGroup = {
    [key: string]: StyleDictionaryV3TokenGroup | StyleDictionaryV3TokenValue;
};
export declare function extractStyleDictionaryV3Tokens(node: StyleDictionaryV3TokenGroup, filePath: string): Map<string, Token>;
