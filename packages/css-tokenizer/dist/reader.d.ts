import { CodePointReader } from './interfaces/code-point-reader';
export declare class Reader implements CodePointReader {
    #private;
    constructor(source: string);
    cursorPositionOfLastReadCodePoint(): number;
    peekOneCodePoint(): number | false;
    peekTwoCodePoints(): [number, number] | [number] | [];
    peekThreeCodePoints(): [number, number, number] | [number, number] | [number] | [];
    peekFourCodePoints(): [number, number, number, number] | [number, number, number] | [number, number] | [number] | [];
    readCodePoint(): number | false;
    unreadCodePoint(): boolean;
    representation(): [number, number];
    representationString(): string;
    resetRepresentation(): void;
    slice(start: number, end: number): string;
}
