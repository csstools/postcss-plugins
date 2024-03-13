import { ComponentValue, ComponentValueType, FunctionNode } from '@csstools/css-parser-algorithms';
import { CSSToken, TokenFunction, TokenType } from '@csstools/css-tokenizer';

export function isNumber(componentValue: ComponentValue): boolean {
	if (
		(componentValue.type === ComponentValueType.Token && (componentValue.value as CSSToken)[0] === TokenType.Number) ||
		(componentValue.type === ComponentValueType.Function && mathFunctions.has(((componentValue as FunctionNode).name as TokenFunction)[4].value.toLowerCase()))
	) {
		return true;
	}

	return false;
}

const mathFunctions = new Set([
	'abs',
	'acos',
	'asin',
	'atan',
	'atan2',
	'calc',
	'clamp',
	'cos',
	'exp',
	'hypot',
	'log',
	'max',
	'min',
	'mod',
	'pow',
	'rem',
	'round',
	'sign',
	'sin',
	'sqrt',
	'tan',
]);

export function isDimension(componentValue: ComponentValue): boolean {
	if (componentValue.type === ComponentValueType.Token && (componentValue.value as CSSToken)[0] === TokenType.Dimension) {
		return true;
	}

	return false;
}

export function isIdent(componentValue: ComponentValue): boolean {
	if (componentValue.type === ComponentValueType.Token && (componentValue.value as CSSToken)[0] === TokenType.Ident) {
		return true;
	}

	return false;
}

const IS_ENV_REGEX = /^env$/i;

export function isEnvironmentVariable(componentValue: ComponentValue): boolean {
	if (componentValue.type === ComponentValueType.Function &&
		IS_ENV_REGEX.test(((componentValue as FunctionNode).name as TokenFunction)[4].value)
	) {
		return true;
	}

	return false;
}
