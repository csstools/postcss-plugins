import { FunctionNode, isCommentNode, isTokenNode, isWhitespaceNode } from '@csstools/css-parser-algorithms';
import { NumberType, TokenType } from '@csstools/css-tokenizer';

export type IssueOpenCondition = {
	repository: string,
	issue: number,
}

export function parseIssueOpenCondition(componentValue: FunctionNode): IssueOpenCondition | false {
	const relevantFunctionArguments = componentValue.value.filter((x) => {
		return !isWhitespaceNode(x) && !isCommentNode(x);
	});
	if (relevantFunctionArguments.length > 2) {
		return false;
	}

	const repository = relevantFunctionArguments[0];
	const issue = relevantFunctionArguments[1];

	if (!repository || !issue) {
		return false;
	}

	if (!isTokenNode(repository) || !isTokenNode(issue)) {
		return false;
	}

	const repositoryToken = repository.value;
	const issueToken = issue.value;

	if (repositoryToken[0] !== TokenType.String) {
		return false;
	}

	if (issueToken[0] !== TokenType.Number || issueToken[4].type !== NumberType.Integer) {
		return false;
	}

	return {
		repository: repositoryToken[4].value,
		issue: issueToken[4].value,
	};
}
