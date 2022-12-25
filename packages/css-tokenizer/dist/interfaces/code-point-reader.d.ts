export type CodePointReader = {
    representationStart: number;
    representationEnd: number;
    cursor: number;
    codePointSource: Array<number>;
    cursorPositionOfLastReadCodePoint(): number;
    advanceCodePoint(n?: number): any;
    readCodePoint(n?: number): number | false;
    unreadCodePoint(n?: number): boolean;
    representationString(): string;
    resetRepresentation(): any;
    slice(start: number, end: number): string;
};
