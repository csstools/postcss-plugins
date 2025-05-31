import { isFunctionNode, isSimpleBlockNode, isTokenNode, isWhitespaceNode, isWhiteSpaceOrCommentNode } from '@csstools/css-parser-algorithms';
import type { ComponentValue, FunctionNode } from '@csstools/css-parser-algorithms';
import type { CSSToken, TokenColon, TokenIdent } from '@csstools/css-tokenizer';
import { isTokenColon, isTokenComma, isTokenDelim, isTokenIdent, isTokenOpenCurly } from '@csstools/css-tokenizer';
import { CustomFunction } from '../nodes/custom-function';
import { FunctionParameter } from '../nodes/function-parameter';

export function parseCustomFunction(componentValues: Array<ComponentValue>): CustomFunction | false {
	let fnNode: FunctionNode | null = null;
	let fnIndex = -1;
	let returnsKeywordIndex = -1;
	let returnTypeIndex = -1;
	let afterIndex = componentValues.length;

	for (let i = 0; i < componentValues.length; i++) {
		const componentValue = componentValues[i];
		if (isWhiteSpaceOrCommentNode(componentValue)) {
			continue;
		}

		if (fnIndex === -1 && isFunctionNode(componentValue)) {
			if (!componentValue.getName().startsWith('--')) {
				return false;
			}

			fnIndex = i;
			fnNode = componentValue;
			continue;
		}

		if (fnIndex !== -1 && returnsKeywordIndex === -1 && isTokenNode(componentValue)) {
			const token = componentValue.value;
			if (!isTokenIdent(token)) {
				return false;
			}

			if (token[4].value.toLowerCase() !== 'returns') {
				return false;
			}

			returnsKeywordIndex = i;
			continue;
		}

		if (returnsKeywordIndex !== -1) {
			returnTypeIndex = i;
			break;
		}

		return false;
	}

	if (returnsKeywordIndex !== -1 && returnTypeIndex === -1) {
		return false;
	}

	if (!fnNode) {
		return false;
	}

	for (let i = (componentValues.length - 1); i > returnTypeIndex; i--) {
		const componentValue = componentValues[i];
		if (isWhiteSpaceOrCommentNode(componentValue)) {
			afterIndex = i;
			continue;
		}

		break;
	}

	const parameters = parseFunctionParameters(fnNode.value);
	if (!parameters) {
		return false;
	}

	return new CustomFunction(
		fnNode,
		parameters,
		returnTypeIndex === -1 ? [] : componentValues.slice(fnIndex + 1, returnTypeIndex).flatMap((x) => {
			return x.tokens();
		}),
		returnTypeIndex === -1 ? [] : componentValues.slice(returnTypeIndex, afterIndex).flatMap((x) => {
			return x.tokens();
		}),
		componentValues.slice(0, fnIndex).flatMap((x) => {
			return x.tokens();
		}),
		componentValues.slice(afterIndex).flatMap((x) => {
			return x.tokens();
		})
	);
}

function parseFunctionParameters(componentValues: Array<ComponentValue>): Array<FunctionParameter> | false {
	if (!componentValues.some(x => !isWhiteSpaceOrCommentNode(x))) {
		return [];
	}

	const parameters: Array<FunctionParameter> = [];

	for (let i = 0; i < componentValues.length; i++) {
		const result = parseFunctionParameter(
			componentValues.slice(i)
		);

		if (!result) {
			return false;
		}

		i += result.advance;
		parameters.push(result.node);
		continue;
	}

	return parameters;
}

function parseFunctionParameter(componentValues: Array<ComponentValue>): { advance: number, node: FunctionParameter } | false {
	let syntaxComponentDepth = 0;

	let nameIndex = -1;
	let nameToken: TokenIdent | null = null;

	let colonIndex = -1;
	let colonToken: TokenColon | null = null;

	let defaultValueIndex = -1;

	let afterIndex = componentValues.length;

	let i = 0;
	for (i = 0; i < componentValues.length; i++) {
		const componentValue = componentValues[i];
		if (isWhiteSpaceOrCommentNode(componentValue)) {
			continue;
		}

		if (
			syntaxComponentDepth === 0 &&
			isTokenNode(componentValue) &&
			isTokenComma(componentValue.value)
		) {
			afterIndex = i;
			break;
		}

		if (nameIndex === -1) {
			if (
				isTokenNode(componentValue) &&
				isTokenIdent(componentValue.value) &&
				componentValue.value[4].value.startsWith('--')
			) {
				nameIndex = i;
				nameToken = componentValue.value;
				continue
			}

			return false;
		}

		if (
			colonIndex === -1 &&
			isTokenNode(componentValue) &&
			isTokenDelim(componentValue.value) &&
			componentValue.value[4].value === '<'
		) {
			syntaxComponentDepth++;
			continue;
		}

		if (
			colonIndex === -1 &&
			syntaxComponentDepth > 0 &&
			isTokenNode(componentValue) &&
			isTokenDelim(componentValue.value) &&
			componentValue.value[4].value === '>'
		) {
			syntaxComponentDepth--;
			continue;
		}

		if (
			colonIndex === -1 &&
			syntaxComponentDepth === 0 &&
			isTokenNode(componentValue) &&
			isTokenColon(componentValue.value)
		) {
			colonIndex = i;
			colonToken = componentValue.value;
			continue;
		}

		if (colonIndex !== -1) {
			defaultValueIndex = i;
			continue;
		}

		if (colonIndex === -1) {
			continue;
		}

		return false;
	}

	if (!nameToken) {
		return false;
	}

	if (colonIndex !== -1 && defaultValueIndex === -1) {
		return false;
	}

	const typeEndIndex = colonIndex !== -1 ? (colonIndex - 1) : (i - 1);

	for (let j = (componentValues.length - 1); j > Math.max(typeEndIndex, defaultValueIndex); j--) {
		const componentValue = componentValues[j];
		if (isWhitespaceNode(componentValue)) {
			afterIndex = j;
			continue;
		}

		break;
	}

	let argumentType: Array<CSSToken> = [];
	{
		const argumentTypeComponentValues = componentValues.slice(nameIndex + 1, typeEndIndex + 1);
		const meaningfulComponentValues = argumentTypeComponentValues.filter((x) => !isWhiteSpaceOrCommentNode(x));
		if (
			meaningfulComponentValues.length === 1 &&
			isFunctionNode(meaningfulComponentValues[0]) &&
			meaningfulComponentValues[0].getName().toLowerCase() === 'type'
		) {
			argumentType = meaningfulComponentValues[0].value.flatMap((x) => {
				return x.tokens();
			})
		} else {
			argumentType = argumentTypeComponentValues.flatMap((x) => {
				return x.tokens();
			})
		}
	}

	let defaultValue: Array<CSSToken> = [];
	if (defaultValueIndex !== -1) {
		const defaultValueComponentValues = componentValues.slice(colonIndex + 1, afterIndex);
		const meaningfulComponentValues = defaultValueComponentValues.filter((x) => !isWhiteSpaceOrCommentNode(x));
		if (
			meaningfulComponentValues.length === 1 &&
			isSimpleBlockNode(meaningfulComponentValues[0]) &&
			isTokenOpenCurly(meaningfulComponentValues[0].startToken)
		) {
			defaultValue = meaningfulComponentValues[0].value.flatMap((x) => {
				return x.tokens();
			})
		} else {
			defaultValue = defaultValueComponentValues.flatMap((x) => {
				return x.tokens();
			})
		}
	}

	return {
		advance: i,
		node: new FunctionParameter(
			nameToken,
			argumentType,
			colonToken,
			defaultValue,
			componentValues.slice(0, nameIndex).flatMap((x) => {
				return x.tokens();
			}),
			componentValues.slice(afterIndex, i + 1).flatMap((x) => {
				return x.tokens();
			})
		)
	};
}
