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
    at(index: number | string): ComponentValue | undefined;
    walk(cb: (entry: {
        node: GeneralEnclosedWalkerEntry;
        parent: GeneralEnclosedWalkerParent;
    }, index: number | string) => boolean | void): false | undefined;
    toJSON(): {
        type: NodeType;
        tokens: CSSToken[];
    };
    isGeneralEnclosed(): this is GeneralEnclosed;
    static isGeneralEnclosed(x: unknown): x is GeneralEnclosed;
}
export type GeneralEnclosedWalkerEntry = ComponentValue;
export type GeneralEnclosedWalkerParent = ContainerNode | GeneralEnclosed;
