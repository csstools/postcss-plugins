import { FunctionNode, isCommentNode, isTokenNode, isWhitespaceNode } from '@csstools/css-parser-algorithms';
import { TokenDimension, TokenIdent, TokenNumber, TokenPercentage, TokenType } from '@csstools/css-tokenizer';

const supportedTokenTypes = [TokenType.Ident, TokenType.Number, TokenType.Percentage, TokenType.Dimension];
const allowedOperators = ['<', '>', '='];

type SubjectToken = TokenIdent | TokenNumber | TokenPercentage | TokenDimension;

export type IfCondition = {
	a: SubjectToken
	b: SubjectToken
	operator: '<' | '>' | '='
}

export function parseIfCondition(componentValue: FunctionNode): IfCondition | false {
	const relevantFunctionArguments = componentValue.value.filter((x) => {
		return !isWhitespaceNode(x) && !isCommentNode(x);
	});
	if (relevantFunctionArguments.length > 3) {
		return false;
	}

	const a = relevantFunctionArguments[0];
	const operator = relevantFunctionArguments[1];
	const b = relevantFunctionArguments[2];

	if (!a || !operator || !b) {
		return false;
	}

	if (!isTokenNode(a) || !isTokenNode(operator) || !isTokenNode(b)) {
		return false;
	}

	const aToken = a.value;
	const operatorToken = operator.value;
	const bToken = b.value;

	if (operatorToken[0] !== TokenType.Delim) {
		return false;
	}

	if (!allowedOperators.includes(operatorToken[4].value)) {
		return false;
	}

	if (!supportedTokenTypes.includes(aToken[0])) {
		return false;
	}

	if (!supportedTokenTypes.includes(bToken[0])) {
		return false;
	}

	return {
		a: aToken as SubjectToken,
		b: bToken as SubjectToken,
		operator: operatorToken[4].value as '<' | '>' | '=',
	};
}
