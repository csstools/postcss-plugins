// Note 1
// The CSS specification refers to units of text as code points.
// We follow this naming.
// This must not be confused with `codePointAt`|`charCodeAt` which are JS API's.
// A char code in JS is equivalent to a code point from the CSS Specification.

export type CodePointReader = {
	peekOneCodePoint(): number | false
	peekTwoCodePoints(): [number, number] | false
	peekThreeCodePoints(): [number, number, number] | false

	readCodePoint(): number | false

	representation(): [number, number]
	resetRepresentation()

	slice(start: number, end: number): string
}
