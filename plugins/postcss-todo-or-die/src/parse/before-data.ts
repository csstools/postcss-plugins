import { FunctionNode, isCommentNode, isTokenNode, isWhitespaceNode } from '@csstools/css-parser-algorithms';
import { NumberType, TokenType } from '@csstools/css-tokenizer';

type BeforeDateCondition = {
	year: number,
	month: number,
	day: number
}

export function parseBeforeDateCondition(componentValue: FunctionNode): BeforeDateCondition | false {
	const relevantFunctionArguments = componentValue.value.filter((x) => {
		return !isWhitespaceNode(x) && !isCommentNode(x);
	});
	if (relevantFunctionArguments.length > 3) {
		return false;
	}

	const year = relevantFunctionArguments[0];
	const month = relevantFunctionArguments[1];
	const day = relevantFunctionArguments[2];

	if (!year || !month || !day) {
		return false;
	}

	if (!isTokenNode(year) || !isTokenNode(month) || !isTokenNode(day)) {
		return false;
	}

	const yearToken = year.value;
	const monthToken = month.value;
	const dayToken = day.value;

	if (yearToken[0] !== TokenType.Number || yearToken[4].type !== NumberType.Integer) {
		return false;
	}

	if (monthToken[0] !== TokenType.Number || monthToken[4].type !== NumberType.Integer) {
		return false;
	}

	if (dayToken[0] !== TokenType.Number || dayToken[4].type !== NumberType.Integer) {
		return false;
	}

	return {
		year: yearToken[4].value,
		month: monthToken[4].value,
		day: dayToken[4].value,
	};
}
