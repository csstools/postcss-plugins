// Note 1
// The CSS specification refers to units of text as code points.
// We follow this naming.
// This must not be confused with `codePointAt`|`charCodeAt` which are JS API's.
// A char code in JS is equivalent to a code point from the CSS Specification.

export type CodePointReader = {
	representationStart: number;
	representationEnd: number;

	cursor: number;
	codePointSource: Array<number>;
	source: string;

	cursorPositionOfLastReadCodePoint(): number;

	advanceCodePoint(n?: number)
	readCodePoint(n?: number): number | false
	unreadCodePoint(n?: number): boolean
}
