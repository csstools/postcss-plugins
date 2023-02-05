import { FunctionNode } from '@csstools/css-parser-algorithms';
export type BeforeDateCondition = {
    year: number;
    month: number;
    day: number;
};
export declare function parseBeforeDateCondition(componentValue: FunctionNode): BeforeDateCondition | false;
