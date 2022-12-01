import { ParserError } from '../interfaces/error';
import { CSSToken } from '@csstools/css-tokenizer';
import { ComponentValue } from '../consume/consume-component-block-function';
export declare function parseCommaSeparatedListOfComponentValues(tokens: Array<CSSToken>, options?: {
    onParseError?: (error: ParserError) => void;
}): ComponentValue[][];
