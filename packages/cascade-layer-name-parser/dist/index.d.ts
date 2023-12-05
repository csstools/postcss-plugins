import { CSSToken } from '@csstools/css-tokenizer';
import { ParseError } from '@csstools/css-tokenizer';

export declare function addLayerToModel(layers: Array<LayerName>, currentLayerNames: Array<LayerName>): LayerName[];

export declare class LayerName {
    parts: Array<CSSToken>;
    constructor(parts: Array<CSSToken>);
    tokens(): Array<CSSToken>;
    slice(start: number, end: number): LayerName;
    concat(other: LayerName): LayerName;
    segments(): Array<string>;
    name(): string;
    equal(other: LayerName): boolean;
    toString(): string;
    toJSON(): {
        parts: CSSToken[];
        segments: string[];
        name: string;
    };
}

declare type Options = {
    onParseError?: (error: ParseError) => void;
};

export declare function parse(source: string, options?: Options): LayerName[];

export declare function parseFromTokens(tokens: Array<CSSToken>, options?: Options): LayerName[];

export { }
