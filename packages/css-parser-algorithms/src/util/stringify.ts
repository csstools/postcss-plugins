import { ComponentValue } from '../consume/consume-component-block-function';
import { stringify as stringifyTokens } from '@csstools/css-tokenizer';

export function stringify(componentValueLists: Array<Array<ComponentValue>>): string {
	return componentValueLists.map((componentValues) => {
		return componentValues.map((x) => stringifyTokens(...x.tokens())).join('');
	}).join(',');
}
