import { ParserError } from '@csstools/css-parser-algorithms/dist/interfaces/error';
import { CSSToken } from '@csstools/css-tokenizer';
import { LayerName } from '../nodes/layer-name';
export type Options = {
    onParseError?: (error: ParserError) => void;
};
export declare function parseFromTokens(tokens: Array<CSSToken>, options?: Options): LayerName[];
export declare function parse(source: string, options?: Options): LayerName[];
