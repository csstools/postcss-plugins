import { ComponentValue, FunctionNode } from '@csstools/css-parser-algorithms';
import { CSSToken, TokenFunction, TokenType } from '@csstools/css-tokenizer';

export function isNumber(componentValue: ComponentValue) {
	if (
		(componentValue.type === 'token' && (componentValue.value as CSSToken)[0] === TokenType.Number) ||
		(componentValue.type === 'function' && ((componentValue as FunctionNode).name as TokenFunction)[4].value === 'calc')
	) {
		return true;
	}

	return false;
}

export function isDimension(componentValue: ComponentValue) {
	if (componentValue.type === 'token' && (componentValue.value as CSSToken)[0] === TokenType.Dimension) {
		return true;
	}

	return false;
}

export function isIdent(componentValue: ComponentValue) {
	if (componentValue.type === 'token' && (componentValue.value as CSSToken)[0] === TokenType.Ident) {
		return true;
	}

	return false;
}
