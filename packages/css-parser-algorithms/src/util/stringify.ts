import type { ComponentValue } from '../consume/component-block-function';
import { stringify as stringifyTokens } from '@csstools/css-tokenizer';

/**
 * Concatenate the string representation of a collection of component values.
 * This is not a proper serializer that will handle escaping and whitespace.
 * It only produces valid CSS for token lists that are also valid.
 */
export function stringify(componentValueLists: Array<Array<ComponentValue>>): string {
	return componentValueLists.map((componentValues) => {
		return componentValues.map((x) => stringifyTokens(...x.tokens())).join('');
	}).join(',');
}
