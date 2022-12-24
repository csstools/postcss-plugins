import { CodePointReader } from './interfaces/code-point-reader';
export declare class Reader implements CodePointReader {
    cursor: number;
    stringSource: string;
    codePointSource: Array<number>;
    length: number;
    representationStart: number;
    representationEnd: number;
    constructor(source: string);
    cursorPositionOfLastReadCodePoint(): number;
    readCodePoint(n?: number): number | false;
    unreadCodePoint(n?: number): boolean;
    representationString(): string;
    resetRepresentation(): void;
    slice(start: number, end: number): string;
}
