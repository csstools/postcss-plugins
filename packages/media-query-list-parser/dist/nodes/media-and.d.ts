import { CSSToken } from '@csstools/css-tokenizer';
import { MediaInParens, MediaInParensWalkerEntry, MediaInParensWalkerParent } from './media-in-parens';
import { NodeType } from '../util/node-type';
export declare class MediaAnd {
    type: NodeType;
    modifier: Array<CSSToken>;
    media: MediaInParens;
    constructor(modifier: Array<CSSToken>, media: MediaInParens);
    tokens(): Array<CSSToken>;
    toString(): string;
    indexOf(item: MediaInParens): number | string;
    at(index: number | string): MediaInParens;
    walk(cb: (entry: {
        node: MediaAndWalkerEntry;
        parent: MediaAndWalkerParent;
    }, index: number | string) => boolean | void): any;
    toJSON(): any;
    isMediaAnd(): this is MediaAnd;
    static isMediaAnd(x: unknown): x is MediaAnd;
}
export declare type MediaAndWalkerEntry = MediaInParensWalkerEntry | MediaInParens;
export declare type MediaAndWalkerParent = MediaInParensWalkerParent | MediaAnd;
