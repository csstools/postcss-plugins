import type { ComponentValue } from '@csstools/css-parser-algorithms';
import type { CSSToken } from '@csstools/css-tokenizer';
import type { FunctionNode } from '@csstools/css-parser-algorithms';
import type { ParseError } from '@csstools/css-tokenizer';
import type { TokenColon } from '@csstools/css-tokenizer';
import type { TokenIdent } from '@csstools/css-tokenizer';

/**
 * A parsed `@function` prelude.
 *
 * https://drafts.csswg.org/css-mixins-1/#function-prelude
 */
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
    getReturnType(): string;
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

/**
 * A `<function-parameter>`.
 *
 * https://drafts.csswg.org/css-mixins-1/#typedef-function-parameter
 */
export declare class FunctionParameter {
    type: NodeType;
    name: TokenIdent;
    parameterType: Array<CSSToken>;
    colon: TokenColon | null;
    defaultValue: Array<CSSToken>;
    before: Array<CSSToken>;
    after: Array<CSSToken>;
    constructor(name: TokenIdent, parameterType: Array<CSSToken>, colon: TokenColon | null, defaultValue: Array<CSSToken>, before?: Array<CSSToken>, after?: Array<CSSToken>);
    /**
     * @deprecated Use `parameterType` instead.
     */
    get argumentType(): Array<CSSToken>;
    set argumentType(value: Array<CSSToken>);
    getName(): string;
    getNameToken(): TokenIdent;
    getParameterType(): string;
    /**
     * @deprecated Use `getParameterType()` instead.
     */
    getArgumentType(): string;
    getDefaultValue(): string | null;
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

/**
 * Parse a `@function` prelude.
 *
 * https://drafts.csswg.org/css-mixins-1/#function-prelude
 */
export declare function parse(source: string, options?: {
    onParseError?: (error: ParseError) => void;
}): CustomFunction | false;

/**
 * Parse the arguments of a `<dashed-function>`.
 *
 * https://drafts.csswg.org/css-mixins-1/#typedef-dashed-function
 */
export declare function parseDashedFunctionArguments(fn: FunctionNode): Array<Array<ComponentValue>> | false;

/**
 * Parse a `@function` prelude from tokens.
 *
 * https://drafts.csswg.org/css-mixins-1/#function-prelude
 */
export declare function parseFromTokens(tokens: Array<CSSToken>, options?: {
    onParseError?: (error: ParseError) => void;
}): CustomFunction | false;

/**
 * Parse a `<function-parameter>#? ,?` list.
 *
 * https://drafts.csswg.org/css-mixins-1/#function-rule
 */
export declare function parseFunctionParameters(componentValues: Array<ComponentValue>): Array<FunctionParameter> | false;

export { }
