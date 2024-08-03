import type { FunctionNode } from '@csstools/css-parser-algorithms';
import type { TokenDimension, TokenIdent, TokenNumber, TokenPercentage } from '@csstools/css-tokenizer';
import { parseIfCondition } from './if';

type SubjectToken = TokenIdent | TokenNumber | TokenPercentage | TokenDimension;

type NotCondition = {
	a: SubjectToken
	b: SubjectToken
	operator: '<' | '>' | '='
}

export function parseNotCondition(componentValue: FunctionNode): NotCondition | false {
	const parsed = parseIfCondition(componentValue);
	if (!parsed) {
		return false;
	}

	return {
		a: parsed.a,
		b: parsed.b,
		operator: parsed.operator,
	};
}
