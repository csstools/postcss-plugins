import { CSSToken } from './interfaces/token';
import { ParseError } from './interfaces/error';
interface Stringer {
    valueOf(): string;
}
export declare function tokenizer(input: {
    css: Stringer;
}, options?: {
    commentsAreTokens?: boolean;
    onParseError?: (error: ParseError) => void;
}): {
    nextToken: () => CSSToken | undefined;
    endOfFile: () => boolean;
};
export {};
