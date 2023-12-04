import { CSSToken, ParseError } from "@csstools/css-tokenizer";
declare class LayerName {
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
// Insert new items after the most similar current item
//
// [["a", "b"]]
// insert "a.first"
// [["a", "a.first", "b"]]
//
// [["a", "a.first", "a.second", "b"]]
// insert "a.first.foo"
// [["a", "a.first", "a.first.foo", "a.second", "b"]]
//
// [["a", "b"]]
// insert "c"
// [["a", "b", "c"]]
declare function addLayerToModel(layers: Array<LayerName>, currentLayerNames: Array<LayerName>): LayerName[];
type Options = {
    onParseError?: (error: ParseError) => void;
};
declare function parseFromTokens(tokens: Array<CSSToken>, options?: Options): LayerName[];
declare function parse(source: string, options?: Options): LayerName[];
export { LayerName, addLayerToModel, parse, parseFromTokens };
