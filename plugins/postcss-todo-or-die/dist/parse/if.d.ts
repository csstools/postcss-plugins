import { FunctionNode } from '@csstools/css-parser-algorithms';
import { TokenDimension, TokenIdent, TokenNumber, TokenPercentage } from '@csstools/css-tokenizer';
type SubjectToken = TokenIdent | TokenNumber | TokenPercentage | TokenDimension;
export type IfCondition = {
    a: SubjectToken;
    b: SubjectToken;
    operator: '<' | '>' | '=';
};
export declare function parseIfCondition(componentValue: FunctionNode): IfCondition | false;
export {};
