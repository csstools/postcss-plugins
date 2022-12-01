import { ComponentValue, ContainerNode } from '@csstools/css-parser-algorithms';
import { CSSToken } from '@csstools/css-tokenizer';
import { NodeType } from '../util/node-type';
export declare class GeneralEnclosed {
    type: NodeType;
    value: ComponentValue;
    constructor(value: ComponentValue);
    tokens(): Array<CSSToken>;
    toString(): string;
    indexOf(item: ComponentValue): number | string;
    at(index: number | string): ComponentValue;
    walk(cb: (entry: {
        node: GeneralEnclosedWalkerEntry;
        parent: GeneralEnclosedWalkerParent;
    }, index: number | string) => boolean | void): boolean;
    toJSON(): {
        type: NodeType;
        tokens: CSSToken[];
    };
    isGeneralEnclosed(): this is GeneralEnclosed;
    static isGeneralEnclosed(x: unknown): x is GeneralEnclosed;
}
export declare type GeneralEnclosedWalkerEntry = ComponentValue;
export declare type GeneralEnclosedWalkerParent = ContainerNode | GeneralEnclosed;
