import type { ComponentValue } from '@csstools/css-parser-algorithms';
import { isFunctionNode, isTokenNode  } from '@csstools/css-parser-algorithms';
import { isTokenDimension, isTokenIdent, isTokenNumber } from '@csstools/css-tokenizer';

export function isNumber(componentValue: ComponentValue): boolean {
	if (
		(isTokenNode(componentValue) && isTokenNumber(componentValue.value)) ||
		(isFunctionNode(componentValue) && mathFunctions.has(componentValue.getName().toLowerCase()))
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
	return isTokenNode(componentValue) && isTokenDimension(componentValue.value);
}

export function isIdent(componentValue: ComponentValue): boolean {
	return isTokenNode(componentValue) && isTokenIdent(componentValue.value);
}

export function isEnvironmentVariable(componentValue: ComponentValue): boolean {
	return isFunctionNode(componentValue) && componentValue.getName().toLowerCase() === 'env';
}
