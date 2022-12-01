import { ComponentValue } from '@csstools/css-parser-algorithms';
import { CSSToken } from '@csstools/css-tokenizer';
import { NodeType } from '../util/node-type';
import { MediaCondition, MediaConditionWalkerEntry, MediaConditionWalkerParent } from './media-condition';
export declare type MediaQuery = MediaQueryWithType | MediaQueryWithoutType | MediaQueryInvalid;
export declare class MediaQueryWithType {
    type: NodeType;
    modifier: Array<CSSToken>;
    mediaType: Array<CSSToken>;
    and: Array<CSSToken>;
    media: MediaCondition | null;
    constructor(modifier: Array<CSSToken>, mediaType: Array<CSSToken>, and?: Array<CSSToken>, media?: MediaCondition | null);
    getModifier(): string;
    negateQuery(): MediaQuery;
    getMediaType(): string;
    tokens(): CSSToken[];
    toString(): string;
    indexOf(item: MediaCondition): number | string;
    at(index: number | string): MediaCondition;
    walk(cb: (entry: {
        node: MediaQueryWithTypeWalkerEntry;
        parent: MediaQueryWithTypeWalkerParent;
    }, index: number | string) => boolean | void): any;
    toJSON(): {
        type: NodeType;
        string: string;
        modifier: CSSToken[];
        mediaType: CSSToken[];
        and: CSSToken[];
        media: MediaCondition;
    };
    isMediaQueryWithType(): this is MediaQueryWithType;
    static isMediaQueryWithType(x: unknown): x is MediaQueryWithType;
}
export declare type MediaQueryWithTypeWalkerEntry = MediaConditionWalkerEntry | MediaCondition;
export declare type MediaQueryWithTypeWalkerParent = MediaConditionWalkerParent | MediaQueryWithType;
export declare class MediaQueryWithoutType {
    type: NodeType;
    media: MediaCondition;
    constructor(media: MediaCondition);
    negateQuery(): MediaQuery;
    tokens(): Array<CSSToken>;
    toString(): string;
    indexOf(item: MediaCondition): number | string;
    at(index: number | string): MediaCondition;
    walk(cb: (entry: {
        node: MediaQueryWithoutTypeWalkerEntry;
        parent: MediaQueryWithoutTypeWalkerParent;
    }, index: number | string) => boolean | void): any;
    toJSON(): {
        type: NodeType;
        string: string;
        media: MediaCondition;
    };
    isMediaQueryWithoutType(): this is MediaQueryWithoutType;
    static isMediaQueryWithoutType(x: unknown): x is MediaQueryWithoutType;
}
export declare type MediaQueryWithoutTypeWalkerEntry = MediaConditionWalkerEntry | MediaCondition;
export declare type MediaQueryWithoutTypeWalkerParent = MediaConditionWalkerParent | MediaQueryWithoutType;
export declare class MediaQueryInvalid {
    type: NodeType;
    media: Array<ComponentValue>;
    constructor(media: Array<ComponentValue>);
    negateQuery(): MediaQuery;
    tokens(): Array<CSSToken>;
    toString(): string;
    walk(cb: (entry: {
        node: MediaQueryInvalidWalkerEntry;
        parent: MediaQueryInvalidWalkerParent;
    }, index: number | string) => boolean | void): boolean;
    toJSON(): {
        type: NodeType;
        string: string;
        media: ComponentValue[];
    };
    isMediaQueryInvalid(): this is MediaQueryInvalid;
    static isMediaQueryInvalid(x: unknown): x is MediaQueryInvalid;
}
export declare type MediaQueryInvalidWalkerEntry = ComponentValue;
export declare type MediaQueryInvalidWalkerParent = ComponentValue | MediaQueryInvalid;
