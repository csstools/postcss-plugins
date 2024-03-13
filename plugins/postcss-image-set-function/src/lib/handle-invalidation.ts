import type { Declaration, Result } from 'postcss';

export const handleInvalidation = (opts: { oninvalid: 'warn' | 'throw' | unknown, decl: Declaration, result: Result }, message: string, word: string): void => {
	if (opts.oninvalid === 'warn') {
		opts.decl.warn(opts.result, message, { word: String(word) });
	} else if (opts.oninvalid === 'throw') {
		throw opts.decl.error(message, { word: String(word) });
	}
};
