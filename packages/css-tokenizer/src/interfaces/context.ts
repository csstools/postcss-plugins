import type { ParseError } from './error';

export type Context = {
	onParseError: (error: ParseError) => void
}
