import { cloneTokens, stringify } from '@csstools/css-tokenizer';
import type { MediaQueryInvalid, MediaQueryWithoutType, MediaQueryWithType } from '../nodes/media-query';
import { parseFromTokens } from '../parser/parse';
import { isMediaQueryInvalid, isMediaQueryWithoutType, isMediaQueryWithType } from './type-predicates';

export function cloneMediaQuery<T extends MediaQueryWithType | MediaQueryWithoutType | MediaQueryInvalid>(x: T): T {
	const tokens = cloneTokens(x.tokens());
	const parsed = parseFromTokens(tokens, { preserveInvalidMediaQueries: true });
	const firstQuery = parsed[0];
	if (!firstQuery) {
		throw new Error(`Failed to clone media query for : "${stringify(...tokens)}"`);
	}

	if (isMediaQueryInvalid(x) && isMediaQueryInvalid(firstQuery)) {
		return firstQuery as T;
	}

	if (isMediaQueryWithType(x) && isMediaQueryWithType(firstQuery)) {
		return firstQuery as T;
	}

	if (isMediaQueryWithoutType(x) && isMediaQueryWithoutType(firstQuery)) {
		return firstQuery as T;
	}

	throw new Error(`Failed to clone media query for : "${stringify(...tokens)}"`);
}
