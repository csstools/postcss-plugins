import { ComponentValue, ContainerNode } from '@csstools/css-parser-algorithms';
import { CSSToken } from '@csstools/css-tokenizer';
import { NodeType } from '../util/node-type';
export declare class MediaFeatureValue {
    type: NodeType;
    value: ComponentValue | Array<ComponentValue>;
    before: Array<CSSToken>;
    after: Array<CSSToken>;
    constructor(value: ComponentValue | Array<ComponentValue>, before?: Array<CSSToken>, after?: Array<CSSToken>);
    tokens(): Array<CSSToken>;
    toString(): string;
    indexOf(item: ComponentValue): number | string;
    at(index: number | string): ComponentValue | Array<ComponentValue> | undefined;
    walk(cb: (entry: {
        node: MediaFeatureValueWalkerEntry;
        parent: MediaFeatureValueWalkerParent;
    }, index: number | string) => boolean | void): false | undefined;
    toJSON(): {
        type: NodeType;
        value: unknown;
        tokens: CSSToken[];
    };
    isMediaFeatureValue(): this is MediaFeatureValue;
    static isMediaFeatureValue(x: unknown): x is MediaFeatureValue;
}
export type MediaFeatureValueWalkerEntry = ComponentValue | Array<ComponentValue>;
export type MediaFeatureValueWalkerParent = ContainerNode | MediaFeatureValue;
export declare function parseMediaFeatureValue(componentValues: Array<ComponentValue>): MediaFeatureValue | false;
export declare function matchesRatioExactly(componentValues: Array<ComponentValue>): number[] | -1;
export declare function matchesRatio(componentValues: Array<ComponentValue>): number[] | -1;
