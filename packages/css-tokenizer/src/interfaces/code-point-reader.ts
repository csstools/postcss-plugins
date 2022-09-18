// Note 1
// The CSS specification refers to units of text as code points.
// We follow this naming.
// This must not be confused with `codePointAt`|`charCodeAt` which are JS API's.
// A char code in JS is equivalent to a code point from the CSS Specification.

export type CodePointReader = {
	cursorPositionOfLastReadCodePoint(): number;

	peekOneCodePoint(): number | false
	peekTwoCodePoints(): [number, number] | [number] | []
	peekThreeCodePoints(): [number, number, number] | [number, number] | [number] | []
	peekFourCodePoints(): [number, number, number, number] | [number, number, number] | [number, number] | [number] | []

	readCodePoint(): number | false
	unreadCodePoint(): boolean

	representation(): [number, number]
	representationString(): string
	resetRepresentation()

	slice(start: number, end: number): string
}
