import { ComponentValue } from '@csstools/css-parser-algorithms';
import { NodeType } from '../util/node-type';
import { CSSToken, TokenIdent } from '@csstools/css-tokenizer';
export declare class MediaFeatureBoolean {
    type: NodeType;
    name: ComponentValue;
    before: Array<CSSToken>;
    after: Array<CSSToken>;
    constructor(name: ComponentValue, before?: Array<CSSToken>, after?: Array<CSSToken>);
    getName(): string;
    getNameToken(): TokenIdent;
    tokens(): Array<CSSToken>;
    toString(): string;
    indexOf(item: ComponentValue): number | string;
    at(index: number | string): ComponentValue;
    toJSON(): {
        type: NodeType;
        name: string;
        tokens: CSSToken[];
    };
    isMediaFeatureBoolean(): this is MediaFeatureBoolean;
    static isMediaFeatureBoolean(x: unknown): x is MediaFeatureBoolean;
}
export declare function parseMediaFeatureBoolean(componentValues: Array<ComponentValue>): false | MediaFeatureBoolean;
