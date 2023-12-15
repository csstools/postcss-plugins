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

export declare abstract class ContainerNodeBaseClass {
    /**
     * The contents of the `Function` or `Simple Block`.
     * This is a list of component values.
     */
    value: Array<ComponentValue>;
    /**
     * Retrieve the index of the given item in the current node.
     * For most node types this will be trivially implemented as `this.value.indexOf(item)`.
     */
    indexOf(item: ComponentValue): number | string;
    /**
     * Retrieve the item at the given index in the current node.
     * For most node types this will be trivially implemented as `this.value[index]`.
     */
    at(index: number | string): ComponentValue | undefined;
    /**
     * Iterates over each item in the `value` array of the current node.
     *
     * @param cb - The callback function to execute for each item.
     * The function receives an object containing the current node (`node`), its parent (`parent`),
     * and an optional `state` object.
     * A second parameter is the index of the current node.
     * The function can return `false` to stop the iteration.
     *
     * @param state - An optional state object that can be used to pass additional information to the callback function.
     * The state object is cloned for each iteration. This means that changes to the state object are not reflected in the next iteration.
     *
     * @returns `false` if the iteration was halted, `undefined` otherwise.
     *
     * @template T - The type of the `state` object.
     * @template U - The type of the current node.
     */
    forEach<T extends Record<string, unknown>, U extends ContainerNode>(this: U, cb: (entry: {
        node: ComponentValue;
        parent: ContainerNode;
        state?: T;
    }, index: number | string) => boolean | void, state?: T): false | undefined;
    /**
     * Walks the current node and all its children.
     *
     * @param cb - The callback function to execute for each item.
     * The function receives an object containing the current node (`node`), its parent (`parent`),
     * and an optional `state` object.
     * A second parameter is the index of the current node.
     * The function can return `false` to stop the iteration.
     *
     * @param state - An optional state object that can be used to pass additional information to the callback function.
     * The state object is cloned for each iteration. This means that changes to the state object are not reflected in the next iteration.
     * However changes are passed down to child node iterations.
     *
     * @returns `false` if the iteration was halted, `undefined` otherwise.
     *
     * @template T - The type of the `state` object.
     * @template U - The type of the current node.
     */
    walk<T extends Record<string, unknown>, U extends ContainerNode>(this: U, cb: (entry: {
        node: ComponentValue;
        parent: ContainerNode;
        state?: T;
    }, index: number | string) => boolean | void, state?: T): false | undefined;
}

export declare class FunctionNode extends ContainerNodeBaseClass {
    /**
     * The node type
     * Always `ComponentValueType.Function`
     */
    type: ComponentValueType;
    /**
     * The token for the name of the function.
     */
    name: TokenFunction;
    /**
     * The token for the closing parenthesis of the function.
     * If the function is unclosed, this will be an EOF token.
     */
    endToken: CSSToken;
    constructor(name: TokenFunction, endToken: CSSToken, value: Array<ComponentValue>);
    /**
     * Retrieve the name of the current Function.
     * This is the parsed and unescaped name of the function.
     */
    getName(): string;
    /**
     * Normalize the current Function:
     * - if the "endToken" is EOF, replace with a ")-token"
     */
    normalize(): void;
    /**
     * Retrieve the tokens for the current Function.
     * This is the inverse of parsing from a list of tokens.
     */
    tokens(): Array<CSSToken>;
    /**
     * Convert the current Function to a string.
     * This is not a true serialization.
     * It is purely a concatenation of the string representation of the tokens.
     */
    toString(): string;
    /**
     * A debug helper to convert the current object to a JSON representation.
     * This is useful in asserts and to store large ASTs in files.
     */
    toJSON(): unknown;
    /**
     * Check if the current object is a FunctionNode.
     * This is a type guard to help with type narrowing.
     */
    isFunctionNode(): this is FunctionNode;
    /**
     * Check if the given object is a FunctionNode.
     * This is a type guard to help with type narrowing.
     */
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

export declare class SimpleBlockNode extends ContainerNodeBaseClass {
    type: ComponentValueType;
    startToken: CSSToken;
    endToken: CSSToken;
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

/**
 * Generate a function that finds the next element that should be visited when walking an AST.
 * Rules :
 * - the previous iteration is used as a reference, so any checks are relative to the start of the current iteration.
 * - the next element always appears after the current index.
 * - the next element always exists in the list.
 * - replacing an element does not cause the replaced element to be visited.
 * - removing an element does not cause elements to be skipped.
 * - an element added later in the list will be visited.
 */
export declare function walkerIndexGenerator<T>(initialList: Array<T>): (list: Array<T>, child: T, index: number) => number;

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
