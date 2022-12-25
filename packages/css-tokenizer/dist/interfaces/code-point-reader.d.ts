export type CodePointReader = {
    representationStart: number;
    representationEnd: number;
    cursor: number;
    codePointSource: Array<number>;
    source: string;
    cursorPositionOfLastReadCodePoint(): number;
    advanceCodePoint(n?: number): any;
    readCodePoint(n?: number): number | false;
    unreadCodePoint(n?: number): boolean;
};
