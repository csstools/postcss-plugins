import { ComponentValue, SimpleBlockNode } from '@csstools/css-parser-algorithms';
import { MediaAnd } from '../nodes/media-and';
import { MediaCondition } from '../nodes/media-condition';
import { MediaConditionListWithOr } from '../nodes/media-condition-list';
import { MediaNot } from '../nodes/media-not';
import { MediaOr } from '../nodes/media-or';
import { MediaQueryWithoutType, MediaQueryWithType } from '../nodes/media-query';
export declare function parseMediaQuery(componentValues: Array<ComponentValue>): false | MediaQueryWithType | MediaQueryWithoutType;
export declare function parseMediaConditionListWithOr(componentValues: Array<ComponentValue>): false | MediaConditionListWithOr;
export declare function parseMediaConditionListWithAnd(componentValues: Array<ComponentValue>): any;
export declare function parseMediaCondition(componentValues: Array<ComponentValue>): any;
export declare function parseMediaConditionWithoutOr(componentValues: Array<ComponentValue>): false | MediaCondition;
export declare function parseMediaInParens(componentValues: Array<ComponentValue>): any;
export declare function parseMediaInParensFromSimpleBlock(simpleBlock: SimpleBlockNode): any;
export declare function parseMediaNot(componentValues: Array<ComponentValue>): false | MediaNot;
export declare function parseMediaOr(componentValues: Array<ComponentValue>): false | {
    advance: number;
    node: MediaOr;
};
export declare function parseMediaAnd(componentValues: Array<ComponentValue>): false | {
    advance: number;
    node: MediaAnd;
};
