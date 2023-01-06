import { CSSToken } from '@csstools/css-tokenizer';
import { MediaInParens, MediaInParensWalkerEntry, MediaInParensWalkerParent } from './media-in-parens';
import { NodeType } from '../util/node-type';
export declare class MediaOr {
    type: NodeType;
    modifier: Array<CSSToken>;
    media: MediaInParens;
    constructor(modifier: Array<CSSToken>, media: MediaInParens);
    tokens(): Array<CSSToken>;
    toString(): string;
    indexOf(item: MediaInParens): number | string;
    at(index: number | string): MediaInParens | undefined;
    walk(cb: (entry: {
        node: MediaOrWalkerEntry;
        parent: MediaOrWalkerParent;
    }, index: number | string) => boolean | void): any;
    toJSON(): any;
    isMediaOr(): this is MediaOr;
    static isMediaOr(x: unknown): x is MediaOr;
}
export type MediaOrWalkerEntry = MediaInParensWalkerEntry | MediaInParens;
export type MediaOrWalkerParent = MediaInParensWalkerParent | MediaOr;
