import { ComponentValue } from '@csstools/css-parser-algorithms';
import { CSSToken, TokenDelim } from '@csstools/css-tokenizer';
import { MediaFeatureName } from './media-feature-name';
import { MediaFeatureValue, MediaFeatureValueWalkerEntry, MediaFeatureValueWalkerParent } from './media-feature-value';
import { NodeType } from '../util/node-type';
export type MediaFeatureRange = MediaFeatureRangeNameValue | MediaFeatureRangeValueName | MediaFeatureRangeValueNameValue;
export declare class MediaFeatureRangeNameValue {
    type: NodeType;
    name: MediaFeatureName;
    operator: [TokenDelim, TokenDelim] | [TokenDelim];
    value: MediaFeatureValue;
    constructor(name: MediaFeatureName, operator: [TokenDelim, TokenDelim] | [TokenDelim], value: MediaFeatureValue);
    operatorKind(): false | import("./media-feature-comparison").MediaFeatureComparison;
    getName(): void;
    getNameToken(): void;
    tokens(): Array<CSSToken>;
    toString(): string;
    indexOf(item: MediaFeatureName | MediaFeatureValue): number | string;
    at(index: number | string): MediaFeatureName | MediaFeatureValue;
    walk(cb: (entry: {
        node: MediaFeatureRangeWalkerEntry;
        parent: MediaFeatureRangeWalkerParent;
    }, index: number | string) => boolean | void): boolean;
    toJSON(): {
        type: NodeType;
        name: {
            type: NodeType;
            name: string;
            tokens: CSSToken[];
        };
        value: {
            type: NodeType;
            value: any;
            tokens: CSSToken[];
        };
        tokens: CSSToken[];
    };
    isMediaFeatureRangeNameValue(): this is MediaFeatureRangeNameValue;
    static isMediaFeatureRangeNameValue(x: unknown): x is MediaFeatureRangeNameValue;
}
export declare class MediaFeatureRangeValueName {
    type: NodeType;
    name: MediaFeatureName;
    operator: [TokenDelim, TokenDelim] | [TokenDelim];
    value: MediaFeatureValue;
    constructor(name: MediaFeatureName, operator: [TokenDelim, TokenDelim] | [TokenDelim], value: MediaFeatureValue);
    operatorKind(): false | import("./media-feature-comparison").MediaFeatureComparison;
    getName(): void;
    getNameToken(): void;
    tokens(): Array<CSSToken>;
    toString(): string;
    indexOf(item: MediaFeatureName | MediaFeatureValue): number | string;
    at(index: number | string): MediaFeatureName | MediaFeatureValue;
    walk(cb: (entry: {
        node: MediaFeatureRangeWalkerEntry;
        parent: MediaFeatureRangeWalkerParent;
    }, index: number | string) => boolean | void): boolean;
    toJSON(): {
        type: NodeType;
        name: {
            type: NodeType;
            name: string;
            tokens: CSSToken[];
        };
        value: {
            type: NodeType;
            value: any;
            tokens: CSSToken[];
        };
        tokens: CSSToken[];
    };
    isMediaFeatureRangeValueName(): this is MediaFeatureRangeValueName;
    static isMediaFeatureRangeValueName(x: unknown): x is MediaFeatureRangeValueName;
}
export declare class MediaFeatureRangeValueNameValue {
    type: NodeType;
    name: MediaFeatureName;
    valueOne: MediaFeatureValue;
    valueOneOperator: [TokenDelim, TokenDelim] | [TokenDelim];
    valueTwo: MediaFeatureValue;
    valueTwoOperator: [TokenDelim, TokenDelim] | [TokenDelim];
    constructor(name: MediaFeatureName, valueOne: MediaFeatureValue, valueOneOperator: [TokenDelim, TokenDelim] | [TokenDelim], valueTwo: MediaFeatureValue, valueTwoOperator: [TokenDelim, TokenDelim] | [TokenDelim]);
    valueOneOperatorKind(): false | import("./media-feature-comparison").MediaFeatureComparison;
    valueTwoOperatorKind(): false | import("./media-feature-comparison").MediaFeatureComparison;
    getName(): void;
    getNameToken(): void;
    tokens(): Array<CSSToken>;
    toString(): string;
    indexOf(item: MediaFeatureName | MediaFeatureValue): number | string;
    at(index: number | string): MediaFeatureName | MediaFeatureValue;
    walk(cb: (entry: {
        node: MediaFeatureRangeWalkerEntry;
        parent: MediaFeatureRangeWalkerParent;
    }, index: number | string) => boolean | void): boolean;
    toJSON(): {
        type: NodeType;
        name: {
            type: NodeType;
            name: string;
            tokens: CSSToken[];
        };
        valueOne: {
            type: NodeType;
            value: any;
            tokens: CSSToken[];
        };
        valueTwo: {
            type: NodeType;
            value: any;
            tokens: CSSToken[];
        };
        tokens: CSSToken[];
    };
    isMediaFeatureRangeValueNameValue(): this is MediaFeatureRangeValueNameValue;
    static isMediaFeatureRangeValueNameValue(x: unknown): x is MediaFeatureRangeValueNameValue;
}
export type MediaFeatureRangeWalkerEntry = MediaFeatureValueWalkerEntry | MediaFeatureValue;
export type MediaFeatureRangeWalkerParent = MediaFeatureValueWalkerParent | MediaFeatureRange;
export declare function parseMediaFeatureRange(componentValues: Array<ComponentValue>): false | MediaFeatureRangeNameValue | MediaFeatureRangeValueName | MediaFeatureRangeValueNameValue;
export declare const mediaDescriptors: Set<string>;
