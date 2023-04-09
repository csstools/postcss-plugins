import { ComponentValue, ComponentValueType, FunctionNode } from '@csstools/css-parser-algorithms';
import { CSSToken, TokenFunction, TokenType } from '@csstools/css-tokenizer';
import { toLowerCaseAZ } from './to-lower-case-a-z';

export function isNumber(componentValue: ComponentValue) {
	if (
		(componentValue.type === ComponentValueType.Token && (componentValue.value as CSSToken)[0] === TokenType.Number) ||
		(componentValue.type === ComponentValueType.Function && mathFunctions.has(toLowerCaseAZ(((componentValue as FunctionNode).name as TokenFunction)[4].value)))
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

export function isDimension(componentValue: ComponentValue) {
	if (componentValue.type === ComponentValueType.Token && (componentValue.value as CSSToken)[0] === TokenType.Dimension) {
		return true;
	}

	return false;
}

export function isIdent(componentValue: ComponentValue) {
	if (componentValue.type === ComponentValueType.Token && (componentValue.value as CSSToken)[0] === TokenType.Ident) {
		return true;
	}

	return false;
}

export function isEnvironmentVariable(componentValue: ComponentValue) {
	if (componentValue.type === ComponentValueType.Function &&
		toLowerCaseAZ(((componentValue as FunctionNode).name as TokenFunction)[4].value) === 'env'
	) {
		return true;
	}

	return false;
}
