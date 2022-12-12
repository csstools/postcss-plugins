import { TokenTransformOptions } from '../../base/token';
export type StyleDictionaryV3TokenValue = {
    cssValue(transformOptions?: TokenTransformOptions): string;
    value: unknown;
    name?: string;
    comment?: string;
    themeable?: boolean;
    attributes?: unknown;
    metadata?: {
        name?: string;
        path: Array<string>;
        filePath: string;
        isSource: boolean;
    };
};
export declare function extractStyleDictionaryV3Token(node: Record<string, unknown>, key: string, path: Array<string>, filePath: string): StyleDictionaryV3TokenValue;
export declare function applyTransformsToValue(value: string | undefined | null, transformOptions?: TokenTransformOptions): string;
