import { FunctionNode } from '@csstools/css-parser-algorithms';
import { TokenDimension, TokenIdent, TokenNumber, TokenPercentage } from '@csstools/css-tokenizer';
type SubjectToken = TokenIdent | TokenNumber | TokenPercentage | TokenDimension;
type NotCondition = {
    a: SubjectToken;
    b: SubjectToken;
    operator: '<' | '>' | '=';
};
export declare function parseNotCondition(componentValue: FunctionNode): NotCondition | false;
export {};
