import { ComponentValue } from '@csstools/css-parser-algorithms';
import { CSSToken } from '@csstools/css-tokenizer';
import { NodeType } from '../util/node-type';
export declare class MediaFeatureName {
    type: NodeType;
    name: ComponentValue;
    before: Array<CSSToken>;
    after: Array<CSSToken>;
    constructor(name: ComponentValue, before?: Array<CSSToken>, after?: Array<CSSToken>);
    getName(): string;
    tokens(): Array<CSSToken>;
    toString(): string;
    indexOf(item: ComponentValue): number | string;
    at(index: number | string): ComponentValue;
    toJSON(): {
        type: NodeType;
        name: string;
        tokens: CSSToken[];
    };
    isMediaFeatureName(): this is MediaFeatureName;
    static isMediaFeatureName(x: unknown): x is MediaFeatureName;
}
export declare function parseMediaFeatureName(componentValues: Array<ComponentValue>): false | MediaFeatureName;
