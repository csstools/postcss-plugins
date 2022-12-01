import { CSSToken } from './interfaces/token';
import { ParserError } from './interfaces/error';
interface Stringer {
    valueOf(): string;
}
export declare function tokenizer(input: {
    css: Stringer;
}, options?: {
    commentsAreTokens?: boolean;
    onParseError?: (error: ParserError) => void;
}): {
    nextToken: () => CSSToken | undefined;
    endOfFile: () => boolean;
};
export {};
