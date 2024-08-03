/**
 * @internal
 */
export type CodePointReader = {
	representationStart: number;
	representationEnd: number;

	cursor: number;
	source: string;

	advanceCodePoint(n?: number): void
	readCodePoint(): number | undefined
	unreadCodePoint(n?: number): void
	resetRepresentation(): void
}
