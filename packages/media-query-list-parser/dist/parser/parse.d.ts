import { ParserError } from '@csstools/css-parser-algorithms/dist/interfaces/error';
import { CSSToken } from '@csstools/css-tokenizer';
import { MediaQuery } from '../nodes/media-query';
export type Options = {
    preserveInvalidMediaQueries?: boolean;
    onParseError?: (error: ParserError) => void;
};
export declare function parseFromTokens(tokens: Array<CSSToken>, options?: Options): MediaQuery[];
export declare function parse(source: string, options?: Options): MediaQuery[];
