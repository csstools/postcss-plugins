export type CodePointReader = {
    representationStart: number;
    representationEnd: number;
    peekedOne: number | undefined;
    peekedTwo: number | undefined;
    peekedThree: number | undefined;
    peekedFour: number | undefined;
    cursorPositionOfLastReadCodePoint(): number;
    readCodePoint(n?: number): number | false;
    unreadCodePoint(): boolean;
    representationString(): string;
    resetRepresentation(): any;
    slice(start: number, end: number): string;
};
