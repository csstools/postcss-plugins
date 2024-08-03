import type { ParseError } from '@csstools/css-tokenizer';

export type Context = {
	onParseError: (error: ParseError) => void
}
