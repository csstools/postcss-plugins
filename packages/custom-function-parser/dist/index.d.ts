import type { CSSToken } from '@csstools/css-tokenizer';
import type { FunctionNode } from '@csstools/css-parser-algorithms';
import type { ParseError } from '@csstools/css-tokenizer';
import type { TokenColon } from '@csstools/css-tokenizer';
import type { TokenIdent } from '@csstools/css-tokenizer';

export declare class CustomFunction {
    type: NodeType;
    function: FunctionNode;
    parameters: Array<FunctionParameter>;
    returnsKeyword: Array<CSSToken>;
    returnType: Array<CSSToken>;
    before: Array<CSSToken>;
    after: Array<CSSToken>;
    constructor(fn: FunctionNode, parameters: Array<FunctionParameter>, returnsKeyword: Array<CSSToken>, returnType: Array<CSSToken>, before?: Array<CSSToken>, after?: Array<CSSToken>);
    getName(): string;
    tokens(): Array<CSSToken>;
    toString(): string;
    /**
     * @internal
     */
    toJSON(): Record<string, unknown>;
    /**
     * @internal
     */
    isCustomFunction(): this is CustomFunction;
    static isCustomFunction(x: unknown): x is CustomFunction;
}

export declare class FunctionParameter {
    type: NodeType;
    name: TokenIdent;
    argumentType: Array<CSSToken>;
    colon: TokenColon | null;
    defaultValue: Array<CSSToken>;
    before: Array<CSSToken>;
    after: Array<CSSToken>;
    constructor(name: TokenIdent, argumentType: Array<CSSToken>, colon: TokenColon | null, defaultValue: Array<CSSToken>, before?: Array<CSSToken>, after?: Array<CSSToken>);
    getName(): string;
    getNameToken(): TokenIdent | null;
    getArgumentType(): string;
    getDefaultValue(): string;
    tokens(): Array<CSSToken>;
    toString(): string;
    /**
     * @internal
     */
    toJSON(): Record<string, unknown>;
    /**
     * @internal
     */
    isFunctionParameter(): this is FunctionParameter;
    static isFunctionParameter(x: unknown): x is FunctionParameter;
}

export declare function isCustomFunction(x: unknown): x is CustomFunction;

export declare function isFunctionParameter(x: unknown): x is FunctionParameter;

export declare enum NodeType {
    CustomFunction = "custom-function",
    FunctionParameter = "function-parameter"
}

export declare function parse(source: string, options?: {
    onParseError?: (error: ParseError) => void;
}): CustomFunction | false;

export declare function parseFromTokens(tokens: Array<CSSToken>, options?: {
    onParseError?: (error: ParseError) => void;
}): CustomFunction | false;

export { }
