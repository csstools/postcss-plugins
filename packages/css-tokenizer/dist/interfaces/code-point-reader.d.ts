export declare type CodePointReader = {
    cursorPositionOfLastReadCodePoint(): number;
    peekOneCodePoint(): number | false;
    peekTwoCodePoints(): [number, number] | [number] | [];
    peekThreeCodePoints(): [number, number, number] | [number, number] | [number] | [];
    peekFourCodePoints(): [number, number, number, number] | [number, number, number] | [number, number] | [number] | [];
    readCodePoint(): number | false;
    unreadCodePoint(): boolean;
    representation(): [number, number];
    representationString(): string;
    resetRepresentation(): any;
    slice(start: number, end: number): string;
};
