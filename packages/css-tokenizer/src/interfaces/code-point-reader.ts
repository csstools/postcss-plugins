// Note 1
// The CSS specification refers to units of text as code points.
// We follow this naming.
// This must not be confused with `codePointAt`|`charCodeAt` which are JS API's.
// A char code in JS is equivalent to a code point from the CSS Specification.

export type CodePointReader = {
	representationStart: number;
	representationEnd: number;

	peekedOne: number | undefined;
	peekedTwo: number | undefined;
	peekedThree: number | undefined;
	peekedFour: number | undefined;

	cursorPositionOfLastReadCodePoint(): number;

	readCodePoint(n?: number): number | false
	unreadCodePoint(): boolean

	representationString(): string
	resetRepresentation()

	slice(start: number, end: number): string
}
