import { MediaQuery } from '@csstools/media-query-list-parser';
export declare function transformAtMediaListTokens(params: string, replacements: Map<string, {
    truthy: Array<MediaQuery>;
    falsy: Array<MediaQuery>;
}>): Array<{
    replaceWith: string;
    encapsulateWith?: string;
}>;
