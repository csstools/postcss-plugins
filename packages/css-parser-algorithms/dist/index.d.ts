import { CSSToken } from '@csstools/css-tokenizer';
import { ParseError } from '@csstools/css-tokenizer';
import { TokenFunction } from '@csstools/css-tokenizer';

export declare class CommentNode {
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

export declare type ComponentValue = FunctionNode | SimpleBlockNode | WhitespaceNode | CommentNode | TokenNode;

export declare enum ComponentValueType {
    Function = "function",
    SimpleBlock = "simple-block",
    Whitespace = "whitespace",
    Comment = "comment",
    Token = "token"
}

export declare type ContainerNode = FunctionNode | SimpleBlockNode;

export declare class FunctionNode {
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

export declare function gatherNodeAncestry(node: {
    walk(cb: (entry: {
        node: Array<unknown> | unknown;
        parent: unknown;
    }, index: number | string) => boolean | void): false | undefined;
}): Map<unknown, unknown>;

export declare function isCommentNode(x: unknown): x is CommentNode;

export declare function isFunctionNode(x: unknown): x is FunctionNode;

export declare function isSimpleBlockNode(x: unknown): x is SimpleBlockNode;

export declare function isTokenNode(x: unknown): x is TokenNode;

export declare function isWhitespaceNode(x: unknown): x is WhitespaceNode;

export declare function parseCommaSeparatedListOfComponentValues(tokens: Array<CSSToken>, options?: {
    onParseError?: (error: ParseError) => void;
}): ComponentValue[][];

export declare function parseComponentValue(tokens: Array<CSSToken>, options?: {
    onParseError?: (error: ParseError) => void;
}): ComponentValue | undefined;

export declare function parseListOfComponentValues(tokens: Array<CSSToken>, options?: {
    onParseError?: (error: ParseError) => void;
}): ComponentValue[];

export declare function replaceComponentValues(componentValuesList: Array<Array<ComponentValue>>, replaceWith: (componentValue: ComponentValue) => ComponentValue | void): ComponentValue[][];

export declare class SimpleBlockNode {
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

/**
 * Returns the start and end index of a node in the CSS source string.
 */
export declare function sourceIndices(x: {
    tokens(): Array<CSSToken>;
} | Array<{
    tokens(): Array<CSSToken>;
}>): [number, number];

export declare function stringify(componentValueLists: Array<Array<ComponentValue>>): string;

export declare class TokenNode {
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

export declare class WhitespaceNode {
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

export { }
