import { ParserError } from '../interfaces/error';
import { CSSToken } from '@csstools/css-tokenizer';
export declare function parseComponentValue(tokens: Array<CSSToken>, options?: {
    onParseError?: (error: ParserError) => void;
}): import("../consume/consume-component-block-function").ComponentValue;
