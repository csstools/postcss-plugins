import { CodePointReader } from './interfaces/code-point-reader';
export declare class Reader implements CodePointReader {
    cursor: number;
    stringSource: string;
    codePointSource: Array<number>;
    length: number;
    representationStart: number;
    representationEnd: number;
    peekedOne: number | undefined;
    peekedTwo: number | undefined;
    peekedThree: number | undefined;
    constructor(source: string);
    peekedFour: number;
    cursorPositionOfLastReadCodePoint(): number;
    readCodePoint(n?: number): number | false;
    unreadCodePoint(): boolean;
    representationString(): string;
    resetRepresentation(): void;
    slice(start: number, end: number): string;
}
