import { FunctionNode, isCommentNode, isTokenNode, isWhitespaceNode } from '@csstools/css-parser-algorithms';
import { isTokenString } from '@csstools/css-tokenizer';

export function parseBrowserslistCondition(componentValue: FunctionNode) : string|false {
	const relevantFunctionArguments = componentValue.value.filter((x) => {
		return !isWhitespaceNode(x) && !isCommentNode(x);
	});
	if (relevantFunctionArguments.length > 1) {
		return false;
	}

	const browserslist = relevantFunctionArguments[0];
	if (!browserslist) {
		return false;
	}

	if (!isTokenNode(browserslist)) {
		return false;
	}

	const browserslistToken = browserslist.value;
	if (!isTokenString(browserslistToken)) {
		return false;
	}

	return browserslistToken[4].value;
}
