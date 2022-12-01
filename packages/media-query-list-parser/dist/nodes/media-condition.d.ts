import { CSSToken } from '@csstools/css-tokenizer';
import { MediaConditionListWithAnd, MediaConditionListWithAndWalkerEntry, MediaConditionListWithAndWalkerParent, MediaConditionListWithOr, MediaConditionListWithOrWalkerEntry, MediaConditionListWithOrWalkerParent } from './media-condition-list';
import { MediaInParens } from './media-in-parens';
import { MediaNot, MediaNotWalkerEntry, MediaNotWalkerParent } from './media-not';
import { NodeType } from '../util/node-type';
export declare class MediaCondition {
    type: NodeType;
    media: MediaNot | MediaInParens | MediaConditionListWithAnd | MediaConditionListWithOr;
    constructor(media: MediaNot | MediaInParens | MediaConditionListWithAnd | MediaConditionListWithOr);
    tokens(): Array<CSSToken>;
    toString(): string;
    indexOf(item: MediaNot | MediaInParens | MediaConditionListWithAnd | MediaConditionListWithOr): number | string;
    at(index: number | string): MediaInParens | MediaConditionListWithAnd | MediaConditionListWithOr | MediaNot;
    walk(cb: (entry: {
        node: MediaConditionWalkerEntry;
        parent: MediaConditionWalkerParent;
    }, index: number | string) => boolean | void): any;
    toJSON(): any;
    isMediaCondition(): this is MediaCondition;
    static isMediaCondition(x: unknown): x is MediaCondition;
}
export declare type MediaConditionWalkerEntry = MediaNotWalkerEntry | MediaConditionListWithAndWalkerEntry | MediaConditionListWithOrWalkerEntry | MediaNot | MediaConditionListWithAnd | MediaConditionListWithOr;
export declare type MediaConditionWalkerParent = MediaNotWalkerParent | MediaConditionListWithAndWalkerParent | MediaConditionListWithOrWalkerParent | MediaCondition;
