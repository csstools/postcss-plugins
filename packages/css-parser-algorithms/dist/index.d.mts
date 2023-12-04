import { CSSToken, TokenFunction, ParseError } from "@csstools/css-tokenizer";
type Context = {
    onParseError: (error: ParseError) => void;
};
declare enum ComponentValueType {
    Function = "function",
    SimpleBlock = "simple-block",
    Whitespace = "whitespace",
    Comment = "comment",
    Token = "token"
}
type ContainerNode = FunctionNode | SimpleBlockNode;
type ComponentValue = FunctionNode | SimpleBlockNode | WhitespaceNode | CommentNode | TokenNode;
// https://www.w3.org/TR/css-syntax-3/#consume-a-component-value
declare function consumeComponentValue(ctx: Context, tokens: Array<CSSToken>): {
    advance: number;
    node: ComponentValue;
};
declare class FunctionNode {
    type: ComponentValueType;
    name: TokenFunction;
    endToken: CSSToken;
    value: Array<ComponentValue>;
    constructor(name: TokenFunction, endToken: CSSToken, value: Array<ComponentValue>);
    getName(): string;
    /**
     * Normalize the current Function:
     * - if the "endToken" is EOF, replace with a ")-token"
     */
    normalize(): void;
    tokens(): Array<CSSToken>;
    toString(): string;
    indexOf(item: ComponentValue): number | string;
    at(index: number | string): ComponentValue | undefined;
    walk<T extends Record<string, unknown>>(cb: (entry: {
        node: ComponentValue;
        parent: ContainerNode;
        state?: T;
    }, index: number | string) => boolean | void, state?: T): false | undefined;
    toJSON(): unknown;
    isFunctionNode(): this is FunctionNode;
    static isFunctionNode(x: unknown): x is FunctionNode;
}
// https://www.w3.org/TR/css-syntax-3/#consume-function
declare function consumeFunction(ctx: Context, tokens: Array<CSSToken>): {
    advance: number;
    node: FunctionNode;
};
declare class SimpleBlockNode {
    type: ComponentValueType;
    startToken: CSSToken;
    endToken: CSSToken;
    value: Array<ComponentValue>;
    constructor(startToken: CSSToken, endToken: CSSToken, value: Array<ComponentValue>);
    /**
     * Normalize the current Simple Block:
     * - if the "endToken" is EOF, replace with the mirror token of the "startToken"
     */
    normalize(): void;
    tokens(): Array<CSSToken>;
    toString(): string;
    indexOf(item: ComponentValue): number | string;
    at(index: number | string): ComponentValue | undefined;
    walk<T extends Record<string, unknown>>(cb: (entry: {
        node: ComponentValue;
        parent: ContainerNode;
        state?: T;
    }, index: number | string) => boolean | void, state?: T): false | undefined;
    toJSON(): unknown;
    isSimpleBlockNode(): this is SimpleBlockNode;
    static isSimpleBlockNode(x: unknown): x is SimpleBlockNode;
}
/** https://www.w3.org/TR/css-syntax-3/#consume-simple-block */
declare function consumeSimpleBlock(ctx: Context, tokens: Array<CSSToken>): {
    advance: number;
    node: SimpleBlockNode;
};
declare class WhitespaceNode {
    type: ComponentValueType;
    value: Array<CSSToken>;
    constructor(value: Array<CSSToken>);
    tokens(): Array<CSSToken>;
    toString(): string;
    toJSON(): {
        type: ComponentValueType;
        tokens: CSSToken[];
    };
    isWhitespaceNode(): this is WhitespaceNode;
    static isWhitespaceNode(x: unknown): x is WhitespaceNode;
}
declare function consumeWhitespace(ctx: Context, tokens: Array<CSSToken>): {
    advance: number;
    node: WhitespaceNode;
};
declare class CommentNode {
    type: ComponentValueType;
    value: CSSToken;
    constructor(value: CSSToken);
    tokens(): Array<CSSToken>;
    toString(): string;
    toJSON(): {
        type: ComponentValueType;
        tokens: CSSToken[];
    };
    isCommentNode(): this is CommentNode;
    static isCommentNode(x: unknown): x is CommentNode;
}
declare function consumeComment(ctx: Context, tokens: Array<CSSToken>): {
    advance: number;
    node: CommentNode;
};
declare function consumeAllCommentsAndWhitespace(ctx: Context, tokens: Array<CSSToken>): {
    advance: number;
    nodes: Array<WhitespaceNode | CommentNode>;
};
declare class TokenNode {
    type: ComponentValueType;
    value: CSSToken;
    constructor(value: CSSToken);
    tokens(): Array<CSSToken>;
    toString(): string;
    toJSON(): {
        type: ComponentValueType;
        tokens: CSSToken[];
    };
    isTokenNode(): this is TokenNode;
    static isTokenNode(x: unknown): x is TokenNode;
}
declare function parseComponentValue(tokens: Array<CSSToken>, options?: {
    onParseError?: (error: ParseError) => void;
}): ComponentValue | undefined;
declare function parseListOfComponentValues(tokens: Array<CSSToken>, options?: {
    onParseError?: (error: ParseError) => void;
}): ComponentValue[];
declare function parseCommaSeparatedListOfComponentValues(tokens: Array<CSSToken>, options?: {
    onParseError?: (error: ParseError) => void;
}): ComponentValue[][];
interface walkable {
    walk(cb: (entry: {
        node: Array<unknown> | unknown;
        parent: unknown;
    }, index: number | string) => boolean | void): false | undefined;
}
declare function gatherNodeAncestry(node: walkable): Map<unknown, unknown>;
declare function replaceComponentValues(componentValuesList: Array<Array<ComponentValue>>, replaceWith: (componentValue: ComponentValue) => ComponentValue | void): ComponentValue[][];
declare function stringify(componentValueLists: Array<Array<ComponentValue>>): string;
declare function isSimpleBlockNode(x: unknown): x is SimpleBlockNode;
declare function isFunctionNode(x: unknown): x is FunctionNode;
declare function isWhitespaceNode(x: unknown): x is WhitespaceNode;
declare function isCommentNode(x: unknown): x is CommentNode;
declare function isTokenNode(x: unknown): x is TokenNode;
interface TokenConvertible {
    tokens(): Array<CSSToken>;
}
/**
 * Returns the start and end index of a node in the CSS source string.
 */
declare function sourceIndices(x: TokenConvertible | Array<TokenConvertible>): [
    number,
    number
];
export { ContainerNode, ComponentValue, consumeComponentValue, FunctionNode, consumeFunction, SimpleBlockNode, consumeSimpleBlock, WhitespaceNode, consumeWhitespace, CommentNode, consumeComment, consumeAllCommentsAndWhitespace, TokenNode, parseComponentValue, parseListOfComponentValues, parseCommaSeparatedListOfComponentValues, gatherNodeAncestry, replaceComponentValues, stringify, ComponentValueType, isCommentNode, isFunctionNode, isSimpleBlockNode, isTokenNode, isWhitespaceNode, sourceIndices };
