import { Token } from '../base/token';
export declare const latestStyleDictionaryVersion = "3";
export declare function extractStyleDictionaryTokens(version: string, node: unknown, filePath: string): Map<string, Token>;
