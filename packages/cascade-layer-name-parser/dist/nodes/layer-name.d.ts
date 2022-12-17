import { CSSToken } from '@csstools/css-tokenizer';
export declare class LayerName {
    parts: Array<CSSToken>;
    constructor(parts: Array<CSSToken>);
    tokens(): Array<CSSToken>;
    slice(start: any, end: any): LayerName;
    segments(): Array<string>;
    name(): string;
    toString(): string;
    toJSON(): {
        parts: CSSToken[];
        segments: string[];
        name: string;
    };
}
