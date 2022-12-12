import { CSSToken, TokenFunction } from '@csstools/css-tokenizer';
import { Context } from '../interfaces/context';
import { ComponentValueType } from '../util/component-value-type';
export type ContainerNode = FunctionNode | SimpleBlockNode;
export type ComponentValue = FunctionNode | SimpleBlockNode | WhitespaceNode | CommentNode | TokenNode | UnclosedSimpleBlockNode | UnclosedFunctionNode;
export declare function consumeComponentValue(ctx: Context, tokens: Array<CSSToken>): {
    advance: number;
    node: ComponentValue;
};
export declare class FunctionNode {
    type: ComponentValueType;
    name: TokenFunction;
    endToken: CSSToken;
    value: Array<ComponentValue>;
    constructor(name: TokenFunction, endToken: CSSToken, value: Array<ComponentValue>);
    nameTokenValue(): string;
    tokens(): Array<CSSToken>;
    toString(): string;
    indexOf(item: ComponentValue): number | string;
    at(index: number | string): ComponentValue;
    walk(cb: (entry: {
        node: ComponentValue;
        parent: ContainerNode;
    }, index: number | string) => boolean | void): boolean;
    toJSON(): any;
    isFunctionNode(): this is FunctionNode;
    static isFunctionNode(x: unknown): x is FunctionNode;
}
export declare function consumeFunction(ctx: Context, tokens: Array<CSSToken>): {
    advance: number;
    node: FunctionNode | UnclosedFunctionNode;
};
export declare class SimpleBlockNode {
    type: ComponentValueType;
    startToken: CSSToken;
    endToken: CSSToken;
    value: Array<ComponentValue>;
    constructor(startToken: CSSToken, endToken: CSSToken, value: Array<ComponentValue>);
    tokens(): Array<CSSToken>;
    toString(): string;
    indexOf(item: ComponentValue): number | string;
    at(index: number | string): ComponentValue;
    walk(cb: (entry: {
        node: ComponentValue;
        parent: ContainerNode;
    }, index: number | string) => boolean | void): boolean;
    toJSON(): any;
    isSimpleBlockNode(): this is SimpleBlockNode;
    static isSimpleBlockNode(x: unknown): x is SimpleBlockNode;
}
/** https://www.w3.org/TR/css-syntax-3/#consume-simple-block */
export declare function consumeSimpleBlock(ctx: Context, tokens: Array<CSSToken>): {
    advance: number;
    node: SimpleBlockNode | UnclosedSimpleBlockNode;
};
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
export declare function consumeWhitespace(ctx: Context, tokens: Array<CSSToken>): {
    advance: number;
    node: WhitespaceNode;
};
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
export declare function consumeComment(ctx: Context, tokens: Array<CSSToken>): {
    advance: number;
    node: CommentNode;
};
export declare function consumeAllCommentsAndWhitespace(ctx: Context, tokens: Array<CSSToken>): {
    advance: number;
    nodes: Array<WhitespaceNode | CommentNode>;
};
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
export declare class UnclosedFunctionNode {
    type: ComponentValueType;
    value: Array<CSSToken>;
    constructor(value: Array<CSSToken>);
    tokens(): Array<CSSToken>;
    toString(): string;
    toJSON(): {
        type: ComponentValueType;
        tokens: CSSToken[];
    };
    isUnclosedFunctionNode(): this is UnclosedFunctionNode;
    static isUnclosedFunctionNode(x: unknown): x is UnclosedFunctionNode;
}
export declare class UnclosedSimpleBlockNode {
    type: ComponentValueType;
    value: Array<CSSToken>;
    constructor(value: Array<CSSToken>);
    tokens(): Array<CSSToken>;
    toString(): string;
    toJSON(): {
        type: ComponentValueType;
        tokens: CSSToken[];
    };
    isUnclosedSimpleBlockNode(): this is UnclosedSimpleBlockNode;
    static isUnclosedSimpleBlockNode(x: unknown): x is UnclosedSimpleBlockNode;
}
